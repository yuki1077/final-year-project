import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { progressApi, booksApi } from '@/services/api';
import { ProgressEntry, Book } from '@/types';
import { toast } from 'sonner';
import { CheckSquare, BookOpen, TrendingUp, Loader2, Search, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

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

export default function PublisherProgress() {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id ? String(currentUser.id) : undefined;
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progressRes, booksRes] = await Promise.all([
        progressApi.getByPublisher(),
        booksApi.getAll(),
      ]);
      setEntries(progressRes.data || []);
      setBooks(booksRes.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter entries to only show progress for publisher's books
  const myBooks = useMemo(
    () => (currentUserId ? books.filter((book) => book.publisherId === currentUserId) : []),
    [books, currentUserId]
  );

  const myBookIds = useMemo(() => {
    return new Set(myBooks.map((book) => book.id));
  }, [myBooks]);

  const filteredEntries = useMemo(() => {
    let entriesList = entries.filter((entry) => myBookIds.has(entry.bookId));
    
    if (!searchTerm) return entriesList;
    
    const term = searchTerm.toLowerCase();
    return entriesList.filter(
      (entry) =>
        entry.bookTitle.toLowerCase().includes(term) ||
        entry.schoolName?.toLowerCase().includes(term) ||
        entry.description?.toLowerCase().includes(term) ||
        entry.status.toLowerCase().includes(term)
    );
  }, [entries, myBookIds, searchTerm]);

  const overallProgress =
    filteredEntries.length > 0
      ? filteredEntries.reduce(
          (sum, item) =>
            sum + (item.status === 'completed' ? 100 : item.status === 'in-progress' ? 50 : 0),
          0
        ) / filteredEntries.length
      : 0;

  // Group entries by book
  const entriesByBook = useMemo(() => {
    const grouped: Record<string, ProgressEntry[]> = {};
    filteredEntries.forEach((entry) => {
      if (!grouped[entry.bookId]) {
        grouped[entry.bookId] = [];
      }
      grouped[entry.bookId].push(entry);
    });
    return grouped;
  }, [filteredEntries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">School Progress</h1>
          <p className="text-muted-foreground mt-2">View progress updates from schools on your books.</p>
        </div>
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
            <p className="text-sm text-muted-foreground mt-1">Currently being studied</p>
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
            <p className="text-sm text-muted-foreground mt-1">Finished by schools</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>Progress Updates</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by book, school, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading progress...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {entries.length === 0
                ? 'No progress updates from schools yet.'
                : 'No progress entries match your search.'}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(entriesByBook).map(([bookId, bookEntries]) => {
                const book = myBooks.find((b) => b.id === bookId);
                return (
                  <div key={bookId} className="space-y-3 border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {book?.title || bookEntries[0]?.bookTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {bookEntries.length} {bookEntries.length === 1 ? 'school' : 'schools'} tracking this book
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {bookEntries.map((entry) => (
                        <div key={entry.id} className="p-4 bg-muted/40 rounded-lg space-y-2">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold uppercase">
                                {entry.schoolName?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{entry.schoolName || 'Unknown School'}</p>
                                <p className="text-xs text-muted-foreground">
                                  Updated {new Date(entry.updatedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge className={`text-xs ${statusColor(entry.status)}`}>
                              {entry.status}
                            </Badge>
                          </div>
                          {entry.description && (
                            <p className="text-sm text-muted-foreground mt-2 pl-12">{entry.description}</p>
                          )}
                        </div>
                      ))}
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

