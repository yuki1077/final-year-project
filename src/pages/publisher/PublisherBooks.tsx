import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { booksApi } from '@/services/api';
import { Book } from '@/types';
import { bookSchema } from '@/lib/validations';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { z } from 'zod';
import { BookOpen, Plus, FilePenLine, Trash2, Search, ImageIcon } from 'lucide-react';

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

export default function PublisherBooks() {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id ? String(currentUser.id) : undefined;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    fetchBooks();
  }, []);

  const myBooks = useMemo(
    () => (currentUserId ? books.filter((book) => book.publisherId === currentUserId) : []),
    [books, currentUserId]
  );

  const filteredBooks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return myBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.subject.toLowerCase().includes(term) ||
        book.grade.toLowerCase().includes(term)
    );
  }, [myBooks, searchTerm]);

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Books</h1>
          <p className="text-muted-foreground mt-2">Manage all your published content in one place.</p>
        </div>
        <Button onClick={() => openDialog()} className="w-full md:w-auto flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Book
        </Button>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>Book Library</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, subject, or grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading books...</p>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              {searchTerm ? 'No books match your search.' : 'No books added yet. Click “Add New Book” to get started.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-muted rounded-lg gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-20 h-28 rounded-md object-cover" />
                    ) : (
                      <div className="w-20 h-28 rounded-md bg-background border flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-foreground">{book.title}</p>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Grade {book.grade} • {book.subject} • ISBN: {book.isbn}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">NPR {book.price.toFixed(2)}</Badge>
                        <Badge variant="secondary">Created {new Date(book.createdAt).toLocaleDateString()}</Badge>
                      </div>
                      {book.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{book.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={() => openDialog(book)}>
                      <FilePenLine className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 md:flex-none"
                      onClick={() => handleDelete(book.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">Upload a cover image (JPG/PNG, max 5MB).</p>
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

