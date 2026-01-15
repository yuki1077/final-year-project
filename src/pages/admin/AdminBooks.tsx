import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { booksApi } from '@/services/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AdminBook {
  id: string;
  title: string;
  grade: string;
  subject: string;
  isbn: string;
  price: number;
  publisherName: string;
  coverImage?: string;
  description?: string;
}

export default function AdminBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<AdminBook | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksApi.getAll();
      setBooks(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm)
      ),
    [books, searchTerm]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Books</h1>
          <p className="text-muted-foreground mt-2">
            Manage all books in the platform
          </p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>Book Catalog</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
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
              Loading books...
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No books match your search.</div>
          ) : (
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-muted rounded-lg gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-16 h-20 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-20 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-lg">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {book.subject} • {book.grade}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">ISBN: {book.isbn}</span>
                        <Badge variant="outline" className="text-xs">
                          {book.publisherName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">NPR {book.price.toFixed(2)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBook(book);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBook?.title ?? 'Book Details'}</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected book.
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              {selectedBook.coverImage && (
                <img src={selectedBook.coverImage} alt={selectedBook.title} className="w-full rounded-lg object-cover" />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <p className="font-medium">{selectedBook.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedBook.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ISBN</p>
                  <p className="font-medium">{selectedBook.isbn}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-medium">NPR {selectedBook.price.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm text-foreground">{selectedBook.description || 'No description provided.'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

