import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  BookOpen,
  Plus,
  Layers,
  BookMarked,
  DollarSign,
  ShoppingCart,
  Percent,
  TrendingUp,
  Download,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { booksApi, ordersApi } from '@/services/api';
import { Book, Order } from '@/types';
import { bookSchema } from '@/lib/validations';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { z } from 'zod';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx';

type BookFormValues = z.infer<typeof bookSchema>;

const defaultValues: BookFormValues = {
  title: '',
  author: '',
  grade: '',
  subject: '',
  isbn: '',
  price: 0,
  description: '',
};

export default function PublisherDashboard() {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id ? String(currentUser.id) : undefined;
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues,
  });

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
    fetchBooks();
    fetchOrders();
  }, []);

  const myBooks = useMemo(
    () => (currentUserId ? books.filter((book) => book.publisherId === currentUserId) : []),
    [books, currentUserId]
  );

  // Calculate sales and profit metrics
  const salesMetrics = useMemo(() => {
    if (!currentUserId || !orders.length) {
      return {
        totalSales: 0,
        totalBooksSold: 0,
        netRevenue: 0,
        profitMargin: 0,
        platformFee: 0,
      };
    }

    // Get all publisher's book IDs
    const publisherBookIds = new Set(myBooks.map((book) => book.id));

    // Calculate sales from orders
    let totalSales = 0;
    let totalBooksSold = 0;

    orders.forEach((order) => {
      if (order.items && order.paymentStatus === 'completed') {
        order.items.forEach((item) => {
          if (publisherBookIds.has(item.bookId)) {
            const itemRevenue = item.price * item.quantity;
            totalSales += itemRevenue;
            totalBooksSold += item.quantity;
          }
        });
      }
    });

    // Platform fee (10% of sales)
    const platformFeeRate = 0.1;
    const platformFee = totalSales * platformFeeRate;
    const netRevenue = totalSales - platformFee;
    const profitMargin = totalSales > 0 ? (netRevenue / totalSales) * 100 : 0;

    return {
      totalSales,
      totalBooksSold,
      netRevenue,
      profitMargin,
      platformFee,
    };
  }, [orders, myBooks, currentUserId]);

  const stats = useMemo(
    () => [
      {
        title: 'Books Published',
        value: myBooks.length,
        icon: BookOpen,
        color: 'bg-primary-light text-primary',
      },
      {
        title: 'Subjects Covered',
        value: new Set(myBooks.map((book) => book.subject)).size,
        icon: Layers,
        color: 'bg-secondary-light text-secondary',
      },
      {
        title: 'Grades Served',
        value: new Set(myBooks.map((book) => book.grade)).size,
        icon: BookMarked,
        color: 'bg-accent-light text-accent',
      },
      {
        title: 'Total Sales',
        value: loadingOrders ? '—' : `NPR ${salesMetrics.totalSales.toFixed(2)}`,
        icon: DollarSign,
        color: 'bg-primary-light text-primary',
      },
      {
        title: 'Books Sold',
        value: loadingOrders ? '—' : salesMetrics.totalBooksSold.toString(),
        icon: ShoppingCart,
        color: 'bg-secondary-light text-secondary',
      },
      {
        title: 'Profit Margin',
        value: loadingOrders ? '—' : `${salesMetrics.profitMargin.toFixed(1)}%`,
        icon: TrendingUp,
        color: 'bg-accent-light text-accent',
      },
    ],
    [myBooks, salesMetrics, loadingOrders]
  );

  // Chart Data: Monthly Sales Trend
  const monthlySalesData = useMemo(() => {
    if (!orders.length) return [];

    const publisherBookIds = new Set(myBooks.map((book) => book.id));
    const monthlyData: { [key: string]: number } = {};

    orders.forEach((order) => {
      if (order.paymentStatus === 'completed' && order.items) {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        order.items.forEach((item) => {
          if (publisherBookIds.has(item.bookId)) {
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + item.price * item.quantity;
          }
        });
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, revenue]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: Number(revenue.toFixed(2)),
      }));
  }, [orders, myBooks]);

  // Chart Data: Top Performing Books
  const topBooksData = useMemo(() => {
    if (!orders.length) return [];

    const publisherBookIds = new Set(myBooks.map((book) => book.id));
    const bookSales: { [key: string]: { title: string; sold: number; revenue: number } } = {};

    orders.forEach((order) => {
      if (order.paymentStatus === 'completed' && order.items) {
        order.items.forEach((item) => {
          if (publisherBookIds.has(item.bookId)) {
            if (!bookSales[item.bookId]) {
              bookSales[item.bookId] = {
                title: item.bookTitle,
                sold: 0,
                revenue: 0,
              };
            }
            bookSales[item.bookId].sold += item.quantity;
            bookSales[item.bookId].revenue += item.price * item.quantity;
          }
        });
      }
    });

    return Object.values(bookSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((book) => ({
        name: book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title,
        sold: book.sold,
        revenue: Number(book.revenue.toFixed(2)),
      }));
  }, [orders, myBooks]);

  // Chart Data: Revenue Breakdown
  const revenueBreakdownData = useMemo(() => {
    if (salesMetrics.totalSales === 0) return [];

    return [
      { name: 'Net Revenue', value: Number(salesMetrics.netRevenue.toFixed(2)) },
      { name: 'Platform Fee (10%)', value: Number(salesMetrics.platformFee.toFixed(2)) },
    ];
  }, [salesMetrics]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const generatePDFReport = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary Statistics
    const summaryData = [
      ['PUBLISHER SALES REPORT'],
      ['Generated:', new Date().toLocaleDateString()],
      ['Publisher:', currentUser?.organizationName || currentUser?.name],
      [],
      ['SUMMARY STATISTICS'],
      ['Total Books Published', myBooks.length],
      ['Total Sales', `NPR ${salesMetrics.totalSales.toFixed(2)}`],
      ['Books Sold', `${salesMetrics.totalBooksSold} units`],
      ['Net Revenue', `NPR ${salesMetrics.netRevenue.toFixed(2)}`],
      ['Platform Fee (10%)', `NPR ${salesMetrics.platformFee.toFixed(2)}`],
      ['Profit Margin', `${salesMetrics.profitMargin.toFixed(2)}%`],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2: Top Performing Books
    const topBooksSheetData = [
      ['Rank', 'Book Title', 'Units Sold', 'Revenue (NPR)'],
      ...topBooksData.map((book, index) => [
        index + 1,
        book.name,
        book.sold,
        book.revenue.toFixed(2),
      ]),
    ];
    const topBooksSheet = XLSX.utils.aoa_to_sheet(topBooksSheetData);
    XLSX.utils.book_append_sheet(workbook, topBooksSheet, 'Top Performing Books');

    // Sheet 3: Monthly Sales Trend
    const monthlySalesSheetData = [
      ['Month', 'Revenue (NPR)'],
      ...monthlySalesData.map((data) => [data.month, data.revenue.toFixed(2)]),
    ];
    const monthlySalesSheet = XLSX.utils.aoa_to_sheet(monthlySalesSheetData);
    XLSX.utils.book_append_sheet(workbook, monthlySalesSheet, 'Monthly Sales');

    // Sheet 4: Book Catalog
    const catalogSheetData = [
      ['Title', 'Author', 'Grade', 'Subject', 'Price (NPR)', 'ISBN'],
      ...myBooks.map((book) => [
        book.title,
        book.author,
        book.grade,
        book.subject,
        book.price.toFixed(2),
        book.isbn,
      ]),
    ];
    const catalogSheet = XLSX.utils.aoa_to_sheet(catalogSheetData);
    XLSX.utils.book_append_sheet(workbook, catalogSheet, 'Book Catalog');

    // Generate Excel file and download
    const fileName = `Publisher_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast.success('Excel report downloaded successfully');
  };

  const openDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      reset({
        title: book.title,
        author: book.author,
        grade: book.grade,
        subject: book.subject,
        isbn: book.isbn,
        price: book.price,
        description: book.description ?? '',
      });
    } else {
      setEditingBook(null);
      reset(defaultValues);
    }
    setCoverFile(null);
    setDialogOpen(true);
  };

  const onSubmit = async (values: BookFormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('author', values.author);
    formData.append('grade', values.grade);
    formData.append('subject', values.subject);
    formData.append('isbn', values.isbn);
    formData.append('price', String(values.price));
    if (values.description) {
      formData.append('description', values.description);
    }
    if (coverFile) {
      formData.append('cover', coverFile);
    }

    try {
      if (editingBook) {
        await booksApi.update(editingBook.id, formData);
        toast.success('Book updated successfully');
      } else {
        await booksApi.create(formData);
        toast.success('Book added successfully');
      }
      setDialogOpen(false);
      setEditingBook(null);
      reset(defaultValues);
      setCoverFile(null);
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to save book');
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      await booksApi.delete(bookId);
      toast.success('Book deleted');
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Publisher Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your catalog and keep it up to date.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generatePDFReport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button onClick={() => openDialog()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Book
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              {stat.title === 'Profit Margin' && salesMetrics.totalSales > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Net Revenue: NPR {salesMetrics.netRevenue.toFixed(2)}
                </p>
              )}
              {stat.title === 'Total Sales' && salesMetrics.totalSales > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Platform Fee: NPR {salesMetrics.platformFee.toFixed(2)} (10%)
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Loading chart data...
              </div>
            ) : monthlySalesData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No sales data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue (NPR)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOrders || revenueBreakdownData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {loadingOrders ? 'Loading chart data...' : 'No revenue data available yet'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Books */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Top Performing Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Loading chart data...
              </div>
            ) : topBooksData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No book sales data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topBooksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sold" fill="#3b82f6" name="Units Sold" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (NPR)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingBook(null);
            reset(defaultValues);
            setCoverFile(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input id="title" {...register('title')} className={errors.title ? 'border-destructive' : ''} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" {...register('author')} className={errors.author ? 'border-destructive' : ''} />
                {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" {...register('grade')} className={errors.grade ? 'border-destructive' : ''} />
                  {errors.grade && <p className="text-sm text-destructive">{errors.grade.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register('subject')} className={errors.subject ? 'border-destructive' : ''} />
                  {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input id="isbn" {...register('isbn')} className={errors.isbn ? 'border-destructive' : ''} />
                {errors.isbn && <p className="text-sm text-destructive">{errors.isbn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (NPR)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} {...register('description')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image</Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setCoverFile(file);
                  }}
                />
                <p className="text-xs text-muted-foreground">Upload a cover image (JPG/PNG, max 5MB).</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingBook ? 'Update Book' : 'Create Book'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
