import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usersApi, booksApi, ordersApi } from '@/services/api';
import { User, Book, Order } from '@/types';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Users, BookOpen, LibraryBig, Loader2, CheckCircle2 } from 'lucide-react';

export default function SchoolDashboard() {
  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [publishers, setPublishers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedPublisherId, setSelectedPublisherId] = useState<string | null>(null);
  const [loadingPublishers, setLoadingPublishers] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookView, setBookView] = useState<'all' | 'my'>('all');

  const fetchPublishers = async () => {
    try {
      setLoadingPublishers(true);
      const response = await usersApi.getPublishers();
      const availablePublishers = response.data || [];
      setPublishers(availablePublishers);
      if (availablePublishers.length && !selectedPublisherId) {
        setSelectedPublisherId(availablePublishers[0].id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load publishers');
    } finally {
      setLoadingPublishers(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const response = await booksApi.getAll();
      setBooks(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load books');
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await ordersApi.getAll();
      setOrders(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
    fetchBooks();
    fetchOrders();
  }, []);

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

  const selectedPublisherBooks = useMemo(() => {
    if (!selectedPublisherId) return [];
    const filtered = books.filter((book) => book.publisherId === selectedPublisherId);
    
    // If viewing "My Books", only show purchased books from selected publisher
    if (bookView === 'my') {
      return filtered.filter((book) => purchasedBookIds.has(book.id));
    }
    
    return filtered;
  }, [books, selectedPublisherId, bookView, purchasedBookIds]);

  const stats = useMemo(
    () => [
      {
        title: 'Available Publishers',
        value: loadingPublishers ? '—' : publishers.length.toString(),
        icon: Users,
        color: 'bg-primary-light text-primary',
      },
      {
        title: 'Total Books',
        value: loadingBooks ? '—' : books.length.toString(),
        icon: BookOpen,
        color: 'bg-secondary-light text-secondary',
      },
      {
        title: 'My Orders',
        value: loadingOrders ? '—' : orders.length.toString(),
        icon: LibraryBig,
        color: 'bg-accent-light text-accent',
      },
      {
        title: 'In Cart',
        value: cartItems.reduce((sum, item) => sum + item.quantity, 0).toString(),
        icon: ShoppingCart,
        color: 'bg-accent-light text-accent',
      },
    ],
    [books.length, cartItems, loadingBooks, loadingPublishers, publishers.length]
  );

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">School Dashboard</h1>
          <p className="text-muted-foreground mt-2">Browse publishers, explore their catalogs, and place orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedPublisherId(null)}>
            Browse Publishers
          </Button>
          <Button variant="default" onClick={() => (window.location.href = '/school/cart')}>
            View Cart ({cartItems.length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Publishers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {loadingPublishers ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading publishers...
              </div>
            ) : publishers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No publishers are available yet.</p>
            ) : (
              publishers.map((publisher) => {
                const publisherBookCount = books.filter((book) => book.publisherId === publisher.id).length;
                const isSelected = selectedPublisherId === publisher.id;

                return (
                  <button
                    key={publisher.id}
                    className={`w-full text-left p-4 border rounded-xl transition ${
                      isSelected ? 'border-primary bg-primary-light/40' : 'hover:border-muted-foreground/40'
                    }`}
                    onClick={() => setSelectedPublisherId(publisher.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{publisher.organizationName || publisher.name}</p>
                        <p className="text-xs text-muted-foreground">{publisher.email}</p>
                      </div>
                      <Badge variant="outline">{publisherBookCount} books</Badge>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <CardTitle>
                {bookView === 'my' 
                  ? 'My Books'
                  : publishers.find((pub) => pub.id === selectedPublisherId)?.organizationName ||
                    publishers.find((pub) => pub.id === selectedPublisherId)?.name ||
                    'Select a publisher'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {bookView === 'my'
                  ? 'Books you have purchased are listed here.'
                  : selectedPublisherId
                  ? 'Here are the books this publisher offers.'
                  : 'Choose a publisher to view their catalog.'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={bookView === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setBookView('all');
                  if (!selectedPublisherId && publishers.length > 0) {
                    setSelectedPublisherId(publishers[0].id);
                  }
                }}
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
          </CardHeader>
          <CardContent>
            {loadingBooks ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading books...
              </div>
            ) : bookView === 'my' ? (
              myBooks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <LibraryBig className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>You haven't purchased any books yet.</p>
                  <p className="text-sm mt-1">Browse publishers and add books to your cart to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {myBooks.map((book) => {
                    const isPurchased = purchasedBookIds.has(book.id);
                    return (
                      <Card 
                        key={book.id} 
                        className="border cursor-pointer hover:shadow-lg transition-all duration-300"
                        onClick={() => handleViewDetails(book)}
                      >
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="h-40 w-full object-cover rounded-t-xl" />
                        ) : (
                          <div className="h-40 w-full bg-muted flex items-center justify-center rounded-t-xl">
                            <BookOpen className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <CardContent className="space-y-3 py-4">
                          <div>
                            <h3 className="font-semibold text-foreground">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <Badge variant="outline">Grade {book.grade}</Badge>
                            <Badge variant="outline">{book.subject}</Badge>
                            {isPurchased && (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Purchased
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg font-semibold text-primary">NPR {book.price.toFixed(2)}</p>
                          {book.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                          )}
                          <Button 
                            className="w-full" 
                            disabled={isPurchased}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(book);
                            }}
                          >
                            {isPurchased ? (
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
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )
            ) : !selectedPublisherId ? (
              <div className="text-center py-12 text-muted-foreground">
                <LibraryBig className="w-10 h-10 mx-auto mb-3" />
                Select a publisher to explore their books.
              </div>
            ) : selectedPublisherBooks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {bookView === 'my' 
                  ? "You haven't purchased any books from this publisher yet."
                  : "This publisher hasn't added any books yet."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedPublisherBooks.map((book) => {
                  const isPurchased = purchasedBookIds.has(book.id);
                  return (
                    <Card 
                      key={book.id} 
                      className="border cursor-pointer hover:shadow-lg transition-all duration-300"
                      onClick={() => handleViewDetails(book)}
                    >
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-40 w-full object-cover rounded-t-xl" />
                      ) : (
                        <div className="h-40 w-full bg-muted flex items-center justify-center rounded-t-xl">
                          <BookOpen className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <CardContent className="space-y-3 py-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">Grade {book.grade}</Badge>
                          <Badge variant="outline">{book.subject}</Badge>
                          {isPurchased && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Purchased
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg font-semibold text-primary">NPR {book.price.toFixed(2)}</p>
                        {book.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                        )}
                        <Button 
                          className="w-full" 
                          disabled={isPurchased}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(book);
                          }}
                        >
                          {isPurchased ? (
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No orders placed yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-foreground">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} • {(order.items?.length ?? 0)} items
                    </p>
                    <div className="text-sm text-muted-foreground mt-1">
                      Total:{' '}
                      <span className="font-medium text-foreground">
                        NPR {Number(order.total ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="capitalize">
                      {order.status}
                    </Badge>
                    <Badge className="bg-primary-light text-primary capitalize">
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Details</DialogTitle>
            <DialogDescription>View complete information about this book</DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-6">
              {selectedBook.coverImage && (
                <div className="w-full h-80 rounded-lg overflow-hidden">
                  <img
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedBook.title}</h3>
                  <p className="text-muted-foreground mt-1">by {selectedBook.author}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">Grade {selectedBook.grade}</Badge>
                  <Badge variant="outline">{selectedBook.subject}</Badge>
                  <Badge variant="outline">ISBN: {selectedBook.isbn}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Publisher</p>
                  <p className="font-medium">{selectedBook.publisherName}</p>
                </div>
                {selectedBook.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-foreground leading-relaxed">{selectedBook.description}</p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      NPR {selectedBook.price.toFixed(2)}
                    </span>
                    {purchasedBookIds.has(selectedBook.id) && (
                      <Badge className="ml-3 bg-green-500 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Already Purchased
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="lg"
                    disabled={purchasedBookIds.has(selectedBook.id)}
                    onClick={() => {
                      handleAddToCart(selectedBook);
                      setDetailsOpen(false);
                    }}
                  >
                    {purchasedBookIds.has(selectedBook.id) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Already Purchased
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
