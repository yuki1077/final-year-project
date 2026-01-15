import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ordersApi } from '@/services/api';
import { Order } from '@/types';
import { toast } from 'sonner';
import { Package, Search, Layers } from 'lucide-react';

const statusColorMap: Record<Order['status'], string> = {
  pending: 'bg-secondary-light text-secondary',
  confirmed: 'bg-primary-light text-primary',
  delivered: 'bg-accent-light text-accent',
  cancelled: 'bg-destructive/10 text-destructive',
};

const paymentColorMap: Record<Order['paymentStatus'], string> = {
  pending: 'bg-secondary-light text-secondary',
  completed: 'bg-primary-light text-primary',
  failed: 'bg-destructive/10 text-destructive',
};

export default function SchoolOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

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

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const orderIdMatch = String(order.id).toLowerCase().includes(term);
      const bookMatch = (order.items || []).some((item) => item.bookTitle.toLowerCase().includes(term));
      return matchesStatus && (term ? orderIdMatch || bookMatch : true);
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-2">Track the status of all your purchases.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders or books..."
              className="pl-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-background"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as Order['status'] | 'all')}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 animate-spin" />
            Loading orders...
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {orders.length === 0 ? 'No orders placed yet.' : 'No orders match your filters.'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="shadow-soft">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • {(order.items?.length ?? 0)} items
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge className={statusColorMap[order.status]}>{order.status}</Badge>
                        <Badge className={paymentColorMap[order.paymentStatus]}>{order.paymentStatus}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">NPR {Number(order.total ?? 0).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>
                <div className="border rounded-xl p-4 bg-muted/40 space-y-2">
                  {(order.items || []).map((item) => (
                    <div key={item.bookId} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground">{item.bookTitle}</p>
                        <p className="text-muted-foreground text-xs">ISBN: {item.bookId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">NPR {(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-muted-foreground text-xs">
                          Qty: {item.quantity} × NPR {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

