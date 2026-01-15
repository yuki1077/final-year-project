import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { feedbackApi, usersApi, ordersApi, booksApi } from '@/services/api';
import { toast } from 'sonner';
import { FeedbackEntry, User, Order, Book } from '@/types';
import { Loader2, Send, MessageCircle } from 'lucide-react';

export default function SchoolFeedback() {
  const [publishers, setPublishers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublisherId, setSelectedPublisherId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  // Get publisher IDs from purchased books
  const purchasedPublisherIds = useMemo(() => {
    const publisherIds = new Set<string>();
    books.forEach((book) => {
      if (purchasedBookIds.has(book.id)) {
        publisherIds.add(book.publisherId);
      }
    });
    return publisherIds;
  }, [books, purchasedBookIds]);

  // Filter publishers to only show those from purchased books
  const availablePublishers = useMemo(() => {
    return publishers.filter((publisher) => 
      publisher.status === 'approved' && purchasedPublisherIds.has(publisher.id)
    );
  }, [publishers, purchasedPublisherIds]);

  // Filter feedback to only show feedback for purchased publishers
  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => purchasedPublisherIds.has(item.publisherId));
  }, [feedback, purchasedPublisherIds]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [publisherRes, feedbackRes, ordersRes, booksRes] = await Promise.all([
        usersApi.getPublishers(),
        feedbackApi.getAll(),
        ordersApi.getAll(),
        booksApi.getAll(),
      ]);
      setPublishers(publisherRes.data || []);
      setFeedback(feedbackRes.data || []);
      setOrders(ordersRes.data || []);
      setBooks(booksRes.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPublisherId || !message.trim()) {
      toast.error('Please pick a publisher and write your feedback.');
      return;
    }

    const publisher = availablePublishers.find((p) => p.id === selectedPublisherId);
    if (!publisher) {
      toast.error('Invalid publisher selected');
      return;
    }

    try {
      setSubmitting(true);
      await feedbackApi.create({
        publisherId: publisher.id,
        publisherName: publisher.organizationName || publisher.name,
        message,
      });
      toast.success('Feedback sent');
      setMessage('');
      setSelectedPublisherId('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
          <p className="text-muted-foreground mt-2">
            Share your experience with publishers. They will see your feedback instantly.
          </p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Publisher</label>
            {availablePublishers.length === 0 ? (
              <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                You need to purchase books from publishers first before you can send feedback.
              </div>
            ) : (
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedPublisherId}
                onChange={(event) => setSelectedPublisherId(event.target.value)}
              >
                <option value="">Choose publisher</option>
                {availablePublishers.map((publisher) => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.organizationName || publisher.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message</label>
            <Textarea
              placeholder="Tell the publisher what you think..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
            />
          </div>
          <Button className="w-full flex items-center gap-2" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading feedback...
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {availablePublishers.length === 0 
                ? 'You haven\'t purchased books from any publishers yet. Purchase books to send feedback.'
                : 'No feedback submitted yet.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div key={item.id} className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">{item.publisherName}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

