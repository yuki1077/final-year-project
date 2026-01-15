import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { progressApi, booksApi, ordersApi } from '@/services/api';
import { ProgressEntry, Book, Order } from '@/types';
import { toast } from 'sonner';
import { CheckSquare, BookOpen, TrendingUp, Loader2, PencilLine, Trash2, Plus } from 'lucide-react';

const statusOptions: { value: ProgressEntry['status']; label: string }[] = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function SchoolProgress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [form, setForm] = useState<{ status: ProgressEntry['status']; description: string }>({
    status: 'in-progress',
    description: '',
  });

  // Get all purchased book IDs from orders
  const purchasedBookIds = useMemo(() => {
    const purchasedIds = new Set<string>();
    orders.forEach((order) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          purchasedIds.add(item.bookId);
        });
      }
    });
    return purchasedIds;
  }, [orders]);

  // Filter books to only show purchased books
  const purchasedBooks = useMemo(() => {
    return books.filter((book) => purchasedBookIds.has(book.id));
  }, [books, purchasedBookIds]);

  // Filter progress entries to only show entries for purchased books
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Check if the entry's bookId is in purchased books
      return purchasedBookIds.has(entry.bookId);
    });
  }, [entries, purchasedBookIds]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progressRes, booksRes, ordersRes] = await Promise.all([
        progressApi.getAll(),
        booksApi.getAll(),
        ordersApi.getAll(),
      ]);
      setEntries(progressRes.data || []);
      setBooks(booksRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingEntry(null);
    setSelectedBookId('');
    setForm({ status: 'in-progress', description: '' });
  };

  const handleSave = async () => {
    try {
      if (!editingEntry && !selectedBookId) {
        toast.error('Please select a book');
        return;
      }

      if (editingEntry) {
        await progressApi.update(editingEntry.id, {
          status: form.status,
          description: form.description,
        });
        toast.success('Progress updated');
      } else {
        const book = books.find((b) => b.id === selectedBookId);
        if (!book) {
          toast.error('Invalid book selected');
          return;
        }
        await progressApi.create({
          bookId: book.id,
          bookTitle: book.title,
          status: form.status,
          description: form.description,
        });
        toast.success('Progress added');
      }
      handleDialogClose();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to save progress');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await progressApi.remove(id);
      toast.success('Progress removed');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete entry');
    }
  };

  const overallProgress =
    filteredEntries.length > 0 ? filteredEntries.reduce((sum, item) => sum + (item.status === 'completed' ? 100 : item.status === 'in-progress' ? 50 : 0), 0) / filteredEntries.length : 0;

  const statusColor = (status: ProgressEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-primary-light text-primary';
      case 'in-progress':
        return 'bg-secondary-light text-secondary';
      case 'not-started':
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Progress</h1>
          <p className="text-muted-foreground mt-2">Track and update progress across books.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Progress
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overallProgress.toFixed(0)}%</div>
            <p className="text-sm text-muted-foreground mt-1">Across all tracked books</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Books in Progress</CardTitle>
            <BookOpen className="w-5 h-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredEntries.filter((entry) => entry.status === 'in-progress').length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Currently studying</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Books</CardTitle>
            <CheckSquare className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredEntries.filter((entry) => entry.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Finished successfully</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading progress...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {purchasedBooks.length === 0 
                ? 'You haven\'t purchased any books yet. Purchase books to track your progress.'
                : 'No progress entries yet. Click "Add Progress" to get started.'}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="space-y-2 border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-medium text-foreground">{entry.bookTitle}</p>
                      <Badge className={`text-xs ${statusColor(entry.status)}`}>{entry.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingEntry(entry);
                          setForm({ status: entry.status, description: entry.description || '' });
                          setDialogOpen(true);
                        }}
                      >
                        <PencilLine className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  {entry.description && (
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => (!open ? handleDialogClose() : setDialogOpen(true))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Progress' : 'Add Progress'}</DialogTitle>
            <DialogDescription>
              {editingEntry ? 'Update the progress details.' : 'Select a book and record your progress.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!editingEntry && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Book</label>
                {purchasedBooks.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                    You need to purchase books first before you can track progress.
                  </div>
                ) : (
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedBookId}
                    onChange={(event) => setSelectedBookId(event.target.value)}
                  >
                    <option value="">Select a book</option>
                    {purchasedBooks.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ProgressEntry['status'] }))}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <Textarea
                placeholder="Describe your progress..."
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                {editingEntry ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

