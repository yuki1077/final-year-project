import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ordersApi } from '@/services/api';
import { Order } from '@/types';
import { toast } from 'sonner';
import { ShoppingCart, Search, Loader2 } from 'lucide-react';

const statusColorMap: Record<Order['status'], string> = {
  pending: 'bg-secondary-light text-secondary',
  confirmed: 'bg-primary-light text-primary',
  delivered: 'bg-accent-light text-accent',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function PublisherOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll();
      setOrders(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      setActionLoadingId(orderId);
      await ordersApi.updateStatus(orderId, status, status === 'delivered' ? 'completed' : undefined);
      toast.success(`Order ${status}`);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update order status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const orderIdMatch = String(order.id).toLowerCase().includes(term);
      const schoolMatch = order.schoolName.toLowerCase().includes(term);
      const bookMatch = (order.items || []).some((item) => item.bookTitle.toLowerCase().includes(term));
      return term ? orderIdMatch || schoolMatch || bookMatch : true;
    });
  }, [orders, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-2">Track orders placed for your titles.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
            </div>
          ) : (
            <div className="space-y-4">
                {filteredOrders.map((order) => {
                const publisherItems = (order.items || []).filter((item) => item.bookId);
                return (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-muted rounded-lg gap-4"
                  >
                <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.schoolName}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                      {publisherItems.length} of {(order.items?.length ?? 0)} items relate to your catalog.
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className={statusColorMap[order.status]}>{order.status}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">NPR {Number(order.total ?? 0).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-end mt-3">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                          disabled={actionLoadingId === order.id}
                        >
                          {actionLoadingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Order'}
                        </Button>
                      )}
                      {order.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          disabled={actionLoadingId === order.id}
                        >
                          {actionLoadingId === order.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Mark Delivered'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

