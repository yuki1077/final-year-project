import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackApi } from '@/services/api';
import { FeedbackEntry } from '@/types';
import { toast } from 'sonner';
import { Loader2, MessageCircle } from 'lucide-react';

export default function PublisherFeedback() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getAll();
      setFeedback(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">School Feedback</h1>
        <p className="text-muted-foreground mt-2">
          See what schools are saying about your books and services.
        </p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Feedback Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading feedback...
            </div>
          ) : feedback.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No feedback yet.</div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className="border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold uppercase">
                        {item.schoolName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.schoolName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

