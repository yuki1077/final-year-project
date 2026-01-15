import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';
import { usersApi } from '@/services/api';
import { User } from '@/types';
import { toast } from 'sonner';

const statusClasses: Record<User['status'], string> = {
  approved: 'bg-primary-light text-primary',
  pending: 'bg-secondary-light text-secondary',
  rejected: 'bg-destructive/10 text-destructive',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll();
      setUsers(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const pendingPublishers = useMemo(
    () => users.filter((user) => user.role === 'publisher' && user.status === 'pending'),
    [users]
  );

  const filteredUsers = useMemo(() => {
    if (filter === 'pending') {
      return pendingPublishers;
    }
    return users.filter((user) => user.role !== 'admin');
  }, [filter, pendingPublishers, users]);

  const stats = useMemo(
    () => [
      {
        title: 'Total Publishers',
        icon: Users,
        value: users.filter((user) => user.role === 'publisher').length,
        color: 'bg-primary-light text-primary',
      },
      {
        title: 'Pending Approvals',
        icon: ShieldAlert,
        value: pendingPublishers.length,
        color: 'bg-secondary-light text-secondary',
      },
      {
        title: 'Approved Publishers',
        icon: ShieldCheck,
        value: users.filter((user) => user.role === 'publisher' && user.status === 'approved').length,
        color: 'bg-accent-light text-accent',
      },
    ],
    [pendingPublishers.length, users]
  );

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await usersApi.updateStatus(id, status);
      toast.success(`Publisher ${status}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Publisher Approvals</h1>
          <p className="text-muted-foreground mt-2">
            Review publisher signups and verify their supporting documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
            Pending
          </Button>
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
            All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
              <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>{filter === 'pending' ? 'Pending Publishers' : 'All Managed Users'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No users found for this filter.</div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border rounded-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold capitalize">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                        <Badge className={statusClasses[user.status]}>{user.status}</Badge>
                        {user.documentUrl && (
                          <a
                            href={user.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline"
                          >
                            View Document
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {user.role === 'publisher' && user.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStatusChange(user.id, 'approved')}>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(user.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

