import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  FileText,
  CheckCircle2
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: BookOpen,
      title: 'Digital Library Access',
      description: 'Access thousands of educational books and resources from verified publishers. Browse, search, and discover content tailored to your needs.',
      features: [
        'Comprehensive book catalog',
        'Advanced search and filters',
        'Digital and physical options',
        'Regular content updates',
      ],
    },
    {
      icon: ShoppingCart,
      title: 'Streamlined Ordering',
      description: 'Simplified ordering process with real-time inventory tracking. Manage your purchases efficiently with our intuitive cart system.',
      features: [
        'Easy-to-use cart system',
        'Bulk ordering support',
        'Order tracking',
        'Secure payment processing',
      ],
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor student progress and learning outcomes with comprehensive analytics. Track completion rates and identify areas for improvement.',
      features: [
        'Real-time progress monitoring',
        'Detailed analytics dashboard',
        'Performance insights',
        'Customizable reports',
      ],
    },
    {
      icon: MessageSquare,
      title: 'Feedback System',
      description: 'Direct communication channel between schools and publishers. Share feedback, suggestions, and collaborate on content improvements.',
      features: [
        'Direct messaging',
        'Feedback collection',
        'Rating system',
        'Response tracking',
      ],
    },
    {
      icon: Users,
      title: 'Publisher Management',
      description: 'For publishers, manage your catalog, track sales, view analytics, and connect directly with schools and educators.',
      features: [
        'Catalog management',
        'Sales analytics',
        'School connections',
        'Performance metrics',
      ],
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security to protect your data and transactions. We ensure your information is safe and confidential.',
      features: [
        'Data encryption',
        'Secure payments',
        'Privacy protection',
        'Regular security audits',
      ],
    },
  ];

  const benefits = [
    {
      title: 'For Schools',
      items: [
        'Access to premium educational content',
        'Easy book ordering and management',
        'Student progress tracking',
        'Direct publisher communication',
        'Cost-effective solutions',
      ],
    },
    {
      title: 'For Publishers',
      items: [
        'Reach a wider audience',
        'Streamlined distribution',
        'Direct school connections',
        'Sales analytics and insights',
        'Feedback collection',
      ],
    },
    {
      title: 'For Educators',
      items: [
        'Rich content library',
        'Progress monitoring tools',
        'Collaboration features',
        'Resource sharing',
        'Professional development',
      ],
    },
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
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="hidden md:flex">
                  Home
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="hidden md:flex">
                  About Us
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="ghost" className="hidden md:flex">
                  Services
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="hidden md:flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="w-full md:w-auto hover:scale-105 transition-transform duration-200">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative w-full py-12 md:py-20 lg:py-32 px-4 md:px-20 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 z-[1]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive solutions designed to meet the needs of schools, publishers, and educators. 
              Everything you need in one powerful platform.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 flex flex-col group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-base text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mt-auto">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for different user types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-base text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account as a school, publisher, or educator. 
                Complete your profile and get verified.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Explore</h3>
              <p className="text-muted-foreground">
                Browse our extensive library of books, connect with publishers, 
                or start adding your content.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Engage</h3>
              <p className="text-muted-foreground">
                Place orders, track progress, provide feedback, and collaborate 
                with the educational community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20 bg-primary-light">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of schools and publishers already using EduConnect. 
            Start your journey today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="default" className="w-full sm:w-auto text-base px-8">
                Create Your Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
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

export default Services;

