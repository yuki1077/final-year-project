import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, CreditCard, Wallet } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { paymentsApi, ordersApi } from '@/services/api';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useAuthStore } from '@/store/authStore';
import { CartItem } from '@/types';

const publishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function SchoolCart() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'esewa'>('esewa');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  // Check for payment callback
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const orderId = searchParams.get('orderId');
    
    if (paymentStatus === 'success') {
      clearCart();
      toast.success('Payment successful! Order placed.');
      navigate('/school/orders');
    } else if (paymentStatus === 'failed') {
      toast.error('Payment failed. Please try again.');
    }
  }, [searchParams, navigate, clearCart]);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      toast.error('Your cart is empty.');
      return;
    }

    if (paymentMethod === 'stripe') {
      if (!stripePromise) {
        toast.error('Stripe publishable key is missing. Please set it in your env file.');
        return;
      }

      try {
        setIsPreparingPayment(true);
        const response = await paymentsApi.createIntent(total);
        setClientSecret(response.clientSecret);
        setPaymentDialogOpen(true);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Unable to start payment. Please try again.');
      } finally {
        setIsPreparingPayment(false);
      }
    } else if (paymentMethod === 'esewa') {
      // Create order first, then redirect to eSewa
      try {
        setIsPreparingPayment(true);
        
        // Create order with pending payment status
        const orderResponse = await ordersApi.create({
          items: cartItems.map((item) => ({
            bookId: item.id,
            bookTitle: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
          paymentStatus: 'pending',
        });

        const orderId = orderResponse.data?.id || orderResponse.id;
        
        // Get eSewa payment URL
        const paymentResponse = await paymentsApi.createEsewaPayment(
          total,
          orderId,
          cartItems.map((item) => ({
            bookId: item.id,
            bookTitle: item.title,
            quantity: item.quantity,
            price: item.price,
          }))
        );

        // Create form and submit to eSewa
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentResponse.paymentUrl;
        
        Object.entries(paymentResponse.params).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Unable to start payment. Please try again.');
        setIsPreparingPayment(false);
      }
    }
  };

  const handleContinueShopping = () => {
    navigate('/school');
  };

  const handleOrderSuccess = () => {
    clearCart();
    setPaymentDialogOpen(false);
    setClientSecret(null);
    toast.success('Payment successful! Order placed.');
    navigate('/school/orders');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">Review your selected books before checkout.</p>
        </div>
        <Button variant="outline" onClick={handleContinueShopping}>
          Browse Publishers
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mb-4">Browse publishers and add books to your cart.</p>
                <Button onClick={handleContinueShopping}>Browse Publishers</Button>
              </CardContent>
            </Card>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-28 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-primary">
                        {item.coverImage ? (
                          <img 
                            src={item.coverImage} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-lg">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Grade {item.grade}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.subject}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-foreground mt-2">NPR {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-soft sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">NPR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (13%)</span>
                  <span className="font-medium">NPR {tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-foreground">NPR {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'esewa')}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="esewa" id="esewa" />
                      <Label htmlFor="esewa" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Wallet className="w-4 h-4" />
                        <span>eSewa</span>
                      </Label>
                    </div>
                    {stripePromise && (
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="w-4 h-4" />
                          <span>Credit/Debit Card (Stripe)</span>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={!cartItems.length || isPreparingPayment}>
                  {isPreparingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Preparing Checkout...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={paymentDialogOpen}
        onOpenChange={(open) => {
          setPaymentDialogOpen(open);
          if (!open) {
            setClientSecret(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Enter your card details to confirm the order.</DialogDescription>
          </DialogHeader>
          {!stripePromise || !clientSecret ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Initializing payment...
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                total={total}
                cartItems={cartItems}
                user={user}
                onSuccess={handleOrderSuccess}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CheckoutFormProps {
  clientSecret: string;
  total: number;
  cartItems: CartItem[];
  user: ReturnType<typeof useAuthStore>['user'];
  onSuccess: () => void;
}

const CheckoutForm = ({ clientSecret, total, cartItems, user, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    try {
      setIsProcessing(true);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: user?.name ?? 'School',
            email: user?.email,
          },
        },
      });

      if (error || paymentIntent?.status !== 'succeeded') {
        toast.error(error?.message || 'Payment failed. Please try again.');
        return;
      }

      await ordersApi.create({
        items: cartItems.map((item) => ({
          bookId: item.id,
          bookTitle: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        paymentStatus: 'completed',
      });

      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Unable to place order.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay NPR {total.toFixed(2)}
            <CreditCard className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
};

