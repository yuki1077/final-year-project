import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ordersApi } from '@/services/api';
import { Order } from '@/types';
import { toast } from 'sonner';
import { Users, Loader2, Search, BookOpen } from 'lucide-react';

interface SchoolSummary {
  schoolId: string;
  schoolName: string;
  totalOrders: number;
  totalBooks: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function PublisherSchools() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolSummary | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll();
      setOrders(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const schools = useMemo<SchoolSummary[]>(() => {
    const summaryMap = new Map<string, SchoolSummary>();
    orders.forEach((order) => {
      const id = String(order.schoolId);
      const existing = summaryMap.get(id) || {
        schoolId: id,
        schoolName: order.schoolName,
        totalOrders: 0,
        totalBooks: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt,
      };

      existing.totalOrders += 1;
      existing.totalBooks += order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
      existing.totalSpent += Number(order.total ?? 0);
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
      }

      summaryMap.set(id, existing);
    });

    const term = searchTerm.toLowerCase();
    return Array.from(summaryMap.values())
      .filter((school) => school.schoolName.toLowerCase().includes(term))
      .sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());
  }, [orders, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Partner Schools</h1>
          <p className="text-muted-foreground mt-2">
            Schools who have ordered your books, along with their engagement details.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Schools Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading schools...
            </div>
          ) : schools.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              {orders.length === 0 ? 'No schools have ordered yet.' : 'No schools match your search.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {schools.map((school) => (
                <Card key={school.schoolId} className="border">
                  <CardContent className="space-y-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold uppercase">
                        {school.schoolName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{school.schoolName}</p>
                        <p className="text-xs text-muted-foreground">
                          Last order: {new Date(school.lastOrderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {school.totalOrders} orders
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {school.totalBooks} books
                      </Badge>
                      <Badge variant="secondary">NPR {school.totalSpent.toFixed(2)}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedSchool(school);
                        setDetailsOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSchool?.schoolName ?? 'School Details'}</DialogTitle>
            <DialogDescription>
              Purchase history and engagement for this school.
            </DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="py-4">
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="text-xl font-semibold">{selectedSchool.totalOrders}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <p className="text-xs text-muted-foreground">Books Purchased</p>
                    <p className="text-xl font-semibold">{selectedSchool.totalBooks}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <p className="text-xs text-muted-foreground">Total Spend</p>
                    <p className="text-xl font-semibold">NPR {selectedSchool.totalSpent.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {orders
                  .filter((order) => String(order.schoolId) === selectedSchool.schoolId)
                  .map((order) => (
                    <Card key={order.id}>
                      <CardContent className="py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Order #{order.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()} •{' '}
                            {(order.items?.length ?? 0)} books
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
                      </CardContent>
                    </Card>
                  ))}
                {orders.filter((order) => String(order.schoolId) === selectedSchool.schoolId).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No order history available.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

