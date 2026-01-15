import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Building2,
  Star,
  Menu,
  X,
  User as UserIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { booksApi, usersApi } from '@/services/api';
import { Book, User } from '@/types';

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [publishers, setPublishers] = useState<User[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingPublishers, setLoadingPublishers] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1569728723358-d1a317aa7fba?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1716329106544-612b35aa9f8e?q=80&w=1061&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch books
      try {
        setLoadingBooks(true);
        const booksResponse = await booksApi.getAll();
        setBooks(booksResponse.data || []);
      } catch (error: any) {
        console.error('Failed to load books:', error);
      } finally {
        setLoadingBooks(false);
      }

      // Fetch publishers
      try {
        setLoadingPublishers(true);
        const publishersResponse = await usersApi.getPublishersPublic();
        setPublishers(publishersResponse.data || []);
      } catch (error: any) {
        console.error('Failed to load publishers:', error);
      } finally {
        setLoadingPublishers(false);
      }
    };

    fetchData();
  }, []);

  // Sort publishers by number of books (descending)
  const sortedPublishers = useMemo(() => {
    if (!publishers.length || !books.length) return publishers;

    // Count books per publisher
    const bookCountMap = books.reduce((acc, book) => {
      const publisherId = book.publisherId;
      acc[publisherId] = (acc[publisherId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort publishers by book count
    return [...publishers].sort((a, b) => {
      const countA = bookCountMap[a.id] || 0;
      const countB = bookCountMap[b.id] || 0;
      return countB - countA; // Descending order
    });
  }, [publishers, books]);

  const features = [
    {
      icon: BookOpen,
      title: 'Rich Content Library',
      description: 'Access thousands of educational resources from trusted publishers',
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Connect with schools, publishers, and educators in one platform',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor student performance and learning outcomes with analytics',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast access to resources and seamless user experience',
    },
    {
      icon: CheckCircle2,
      title: 'Expert Support',
      description: 'Get help from our dedicated education support team',
    },
  ];

  const benefits = [
    'Access to premium educational content',
    'Real-time collaboration tools',
    'Comprehensive analytics dashboard',
    '24/7 platform availability',
    'Regular content updates',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-20 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.jpeg" alt="EduConnect Logo" className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-xl font-bold text-foreground">EduConnect</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/about">
                <Button variant="ghost">
                  About Us
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="ghost">
                  Services
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button>
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-border pt-4">
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  About Us
                </Button>
              </Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Services
                </Button>
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-[45vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image}')`
              }}
            />
          ))}
        </div>
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-[1]"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 md:px-20 py-10 md:py-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/90 backdrop-blur-sm border border-primary/20 rounded-full text-white text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Transforming Education Together</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              Connect, Learn, and{' '}
              <span className="text-primary-light">
                Grow
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              The all-in-one platform connecting schools, publishers, and educators. 
              Access premium content, track progress, and collaborate seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-base px-6 py-5 bg-primary hover:bg-primary/90 text-white shadow-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-6 py-5 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-light mb-1 drop-shadow-lg">
                  {books.length > 0 ? `${books.length}+` : '100+'}
                </div>
                <div className="text-xs md:text-sm text-white/90">Books Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-light mb-1 drop-shadow-lg">
                  {publishers.length > 0 ? `${publishers.length}+` : '50+'}
                </div>
                <div className="text-xs md:text-sm text-white/90">Publishers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-light mb-1 drop-shadow-lg">1000+</div>
                <div className="text-xs md:text-sm text-white/90">Active Schools</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Slider Dots Indicator */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3 bg-black/20 backdrop-blur-sm px-4 md:px-5 py-2 rounded-full">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-8 md:w-10 h-2 md:h-2.5 bg-white shadow-lg'
                  : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Books Carousel Section */}
      <section className="w-full py-16 md:py-24 px-4 md:px-20 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured Books
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of educational books from trusted publishers
            </p>
          </div>

          {loadingBooks ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No books available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.slice(0, 6).map((book) => (
                  <Link key={book.id} to="/login">
                    <Card className="border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 flex flex-col h-full group cursor-pointer">
                      {book.coverImage ? (
                        <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="h-64 w-full bg-gradient-primary rounded-t-xl flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl line-clamp-2">{book.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">by {book.author}</CardDescription>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {book.grade}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {book.subject}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2 font-medium">
                            {book.publisherName}
                          </p>
                          {book.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {book.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-2xl font-bold text-foreground">
                            NPR {book.price}
                          </span>
                          <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-white transition-all duration-200">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!loadingBooks && books.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-base px-8 hover:scale-105 transition-transform duration-200">
                  View All Books
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Publishers Section */}
      <section className="w-full py-16 md:py-24 px-4 md:px-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Trusted Publishers
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with verified educational publishers and access their premium content
            </p>
          </div>

          {loadingPublishers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sortedPublishers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No publishers available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedPublishers.map((publisher) => {
                const bookCount = books.filter(book => book.publisherId === publisher.id).length;
                return (
                <Card key={publisher.id} className="border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-primary">
                        {publisher.profileImage ? (
                          <img 
                            src={publisher.profileImage} 
                            alt={publisher.organizationName || publisher.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl mb-1 line-clamp-1">
                          {publisher.organizationName || publisher.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {publisher.email}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified Publisher
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {bookCount} {bookCount === 1 ? 'Book' : 'Books'} Available
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          )}

          {!loadingPublishers && publishers.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/register">
                <Button size="lg" className="text-base px-8 hover:scale-105 transition-transform duration-200">
                  Become a Publisher
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 px-4 md:px-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance the educational experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-16 md:py-24 px-4 md:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose EduConnect?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of schools and educators who trust EduConnect for their 
                educational needs. Experience the difference of a platform built for education.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-200">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-base text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform duration-200">
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img 
                src="https://plus.unsplash.com/premium_photo-1750530064487-9f357338dd90?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Why Choose EduConnect"
                className="w-full h-full object-cover min-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative w-full py-16 md:py-24 px-4 md:px-20 overflow-hidden"
        style={{
          backgroundImage: "url('https://plus.unsplash.com/premium_photo-1664300897489-fd98eee64faf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85 z-0"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Education Experience?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join EduConnect today and discover how we can help you achieve your educational goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 hover:scale-105 transition-transform duration-200">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-200">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-card py-8 md:py-12 px-4 md:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.jpeg" alt="EduConnect Logo" className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-lg font-bold text-foreground">EduConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting schools, publishers, and educators in one platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground">
                    Services
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: info@educonnect.com
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Phone: +977-1-XXXXXXX
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} EduConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
