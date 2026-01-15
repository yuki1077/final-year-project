import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usersApi, booksApi, ordersApi } from '@/services/api';
import { Order, User } from '@/types';
import { toast } from 'sonner';
import { Users, BookOpen, ShoppingCart, TrendingUp, Layers, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState({
    users: true,
    books: true,
    orders: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      const response = await usersApi.getAll();
      setUsers(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading((prev) => ({ ...prev, books: true }));
      const response = await booksApi.getAll();
      setBooks(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading((prev) => ({ ...prev, books: false }));
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      const response = await ordersApi.getAll();
      setOrders(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchOrders();
  }, []);

  const stats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: loading.users ? '—' : users.length.toString(),
        icon: Users,
        color: 'bg-primary-light text-primary',
        link: '/admin/users',
      },
      {
        title: 'Publishers',
        value: loading.users ? '—' : users.filter((user) => user.role === 'publisher').length.toString(),
        icon: Layers,
        color: 'bg-secondary-light text-secondary',
        link: '/admin/users',
      },
      {
        title: 'Total Books',
        value: loading.books ? '—' : books.length.toString(),
        icon: BookOpen,
        color: 'bg-accent-light text-accent',
        link: '/admin/books',
      },
      {
        title: 'Total Orders',
        value: loading.orders ? '—' : orders.length.toString(),
        icon: ShoppingCart,
        color: 'bg-primary-light text-primary',
        link: '/admin/orders',
      },
      {
        title: 'Revenue',
        value: loading.orders
          ? '—'
          : `NPR ${orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0).toFixed(2)}`,
        icon: TrendingUp,
        color: 'bg-secondary-light text-secondary',
        link: '/admin/reports',
      },
    ],
    [books.length, loading.books, loading.orders, loading.users, orders, users]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time overview of users, books, and orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/books')}>
            Manage Books
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/orders')}>
            Manage Orders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
            onClick={() => stat.link && navigate(stat.link)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Registrations</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            {loading.users ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading users...
              </div>
            ) : (
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            {loading.orders ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading orders...
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.schoolName} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="capitalize mb-1">
                        {order.status}
                      </Badge>
                      <p className="text-sm font-semibold text-foreground">
                        NPR {Number(order.total ?? 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            {loading.orders ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading orders...
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.schoolName} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="capitalize mb-1">
                        {order.status}
                      </Badge>
                      <p className="text-sm font-semibold text-foreground">
                        NPR {Number(order.total ?? 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Books</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/books')}>
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            {loading.books ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading books...
              </div>
            ) : (
              <div className="space-y-4">
                {books.slice(0, 5).map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Grade {book.grade} • {book.publisherName}
                      </p>
                    </div>
                    <Badge variant="outline">NPR {Number(book.price ?? 0).toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue Snapshot</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/reports')}>
              View Report
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading.orders ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Computing metrics...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-lg font-semibold text-foreground">
                    NPR {orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                  <p className="text-lg font-semibold text-foreground">
                    NPR{' '}
                    {orders.length
                      ? (orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0) / orders.length).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <Badge variant="outline">
                    {orders.filter((order) => order.status === 'pending').length} pending
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
