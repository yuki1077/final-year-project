import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Search, ShoppingCart, Eye, Loader2, User, Mail, Building2, LibraryBig, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { booksApi, usersApi, ordersApi } from '@/services/api';
import { Book, User as UserType, Order } from '@/types';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';

export default function SchoolBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [publisher, setPublisher] = useState<UserType | null>(null);
  const [loadingPublisher, setLoadingPublisher] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookView, setBookView] = useState<'all' | 'my'>('all');
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
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
    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersApi.getAll();
        setOrders(response.data || []);
      } catch (error: any) {
        console.error('Failed to load orders:', error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchPublisher = async () => {
      if (!selectedBook?.publisherId) return;
      try {
        setLoadingPublisher(true);
        const response = await usersApi.getAll();
        const publishers = response.data || [];
        const foundPublisher = publishers.find((p: UserType) => p.id === selectedBook.publisherId);
        setPublisher(foundPublisher || null);
      } catch (error: any) {
        console.error('Failed to load publisher:', error);
      } finally {
        setLoadingPublisher(false);
      }
    };
    fetchPublisher();
  }, [selectedBook]);

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

  // Get all purchased books
  const myBooks = useMemo(() => {
    return books.filter((book) => purchasedBookIds.has(book.id));
  }, [books, purchasedBookIds]);

  const filteredBooks = useMemo(() => {
    let bookList = bookView === 'my' ? myBooks : books;
    
    if (!searchTerm) return bookList;
    
    const term = searchTerm.toLowerCase();
    return bookList.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.subject.toLowerCase().includes(term) ||
        book.grade.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.publisherName.toLowerCase().includes(term)
    );
  }, [books, myBooks, bookView, searchTerm]);

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setDetailsOpen(true);
  };

  const handleAddToCart = (book: Book) => {
    // Check if book is already purchased
    if (purchasedBookIds.has(book.id)) {
      toast.error(`"${book.title}" is already in your library. You cannot purchase it again.`);
      return;
    }
    addToCart(book);
    toast.success(`Added "${book.title}" to cart`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Books</h1>
          <p className="text-muted-foreground mt-2">
            Discover and purchase educational books
          </p>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle>{bookView === 'my' ? 'My Books' : 'Available Books'}</CardTitle>
              <div className="flex gap-2 items-center">
                <Button
                  variant={bookView === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBookView('all')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  All Books
                </Button>
                <Button
                  variant={bookView === 'my' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBookView('my')}
                >
                  <LibraryBig className="w-4 h-4 mr-2" />
                  My Books ({myBooks.length})
                </Button>
              </div>
            </div>
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
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {bookView === 'my' 
                ? (searchTerm 
                  ? 'No purchased books match your search.' 
                  : 'You haven\'t purchased any books yet.')
                : (searchTerm 
                  ? 'No books match your search.' 
                  : 'No books available at the moment.')}
              {bookView === 'my' && !searchTerm && (
                <p className="text-sm mt-1">Browse all books and add them to your cart to get started.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const isPurchased = purchasedBookIds.has(book.id);
                return (
                  <Card 
                    key={book.id} 
                    className="shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col cursor-pointer"
                    onClick={() => handleViewDetails(book)}
                  >
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-48 w-full object-cover rounded-t-xl"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-primary rounded-t-xl flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {book.grade}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {book.subject}
                        </Badge>
                        {isPurchased && (
                          <Badge className="bg-green-500 text-white text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Purchased
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {book.publisherName}
                        </p>
                        {book.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                            {book.description}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-foreground">
                            NPR {book.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(book);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            disabled={isPurchased}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(book);
                            }}
                          >
                            {isPurchased ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Purchased
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title ?? 'Book Details'}</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected book and publisher.
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-6">
              {/* Book Cover */}
              {selectedBook.coverImage ? (
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
              )}

              {/* Book Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{selectedBook.title}</h3>
                  <p className="text-lg text-muted-foreground">by {selectedBook.author}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Grade</p>
                    <Badge variant="outline">{selectedBook.grade}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Subject</p>
                    <Badge variant="outline">{selectedBook.subject}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ISBN</p>
                    <p className="font-medium text-sm">{selectedBook.isbn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="font-bold text-lg text-primary">NPR {selectedBook.price.toFixed(2)}</p>
                  </div>
                </div>

                {selectedBook.description && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Description</p>
                    <p className="text-sm text-foreground">{selectedBook.description}</p>
                  </div>
                )}
              </div>

              {/* Publisher Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Publisher Information
                </h4>
                {loadingPublisher ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading publisher information...
                  </div>
                ) : publisher ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {publisher.organizationName || publisher.name}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {publisher.email}
                        </p>
                        {publisher.phone && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Phone: {publisher.phone}
                          </p>
                        )}
                        {publisher.address && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Address: {publisher.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{selectedBook.publisherName}</p>
                    <p>Publisher details not available</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t items-center">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
                {selectedBook && purchasedBookIds.has(selectedBook.id) && (
                  <Badge className="bg-green-500 text-white px-3 py-2 flex items-center mr-auto">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Already Purchased
                  </Badge>
                )}
                <Button
                  className="flex-1"
                  disabled={selectedBook ? purchasedBookIds.has(selectedBook.id) : false}
                  onClick={() => {
                    if (selectedBook) {
                      handleAddToCart(selectedBook);
                      setDetailsOpen(false);
                    }
                  }}
                >
                  {selectedBook && purchasedBookIds.has(selectedBook.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Already Purchased
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

