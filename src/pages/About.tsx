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
  Target,
  Heart,
  Award
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To bridge the gap between educational content providers and institutions, making quality education accessible to all.',
    },
    {
      icon: Heart,
      title: 'Our Vision',
      description: 'To become the leading platform that transforms how educational content is distributed and consumed globally.',
    },
    {
      icon: Award,
      title: 'Our Values',
      description: 'We believe in transparency, collaboration, and innovation to create meaningful educational experiences.',
    },
  ];

  const team = [
    {
      name: 'Education Experts',
      role: 'Curriculum Specialists',
      description: 'Our team of experienced educators ensures quality content.',
    },
    {
      name: 'Technology Team',
      role: 'Platform Developers',
      description: 'Building cutting-edge solutions for modern education.',
    },
    {
      name: 'Support Staff',
      role: 'Customer Success',
      description: 'Dedicated to helping you succeed in your educational journey.',
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
              About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">EduConnect</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We are dedicated to transforming the educational landscape by connecting schools, 
              publishers, and educators in a seamless, innovative platform.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  EduConnect was born from a simple yet powerful idea: education should be accessible, 
                  collaborative, and efficient. We recognized the challenges that schools, publishers, 
                  and educators face in the traditional educational content distribution model.
                </p>
                <p className="text-lg">
                  Our platform was designed to eliminate barriers, streamline processes, and create a 
                  unified ecosystem where educational content flows seamlessly from publishers to schools, 
                  and learning outcomes are tracked and improved continuously.
                </p>
                <p className="text-lg">
                  Today, we serve hundreds of institutions and publishers, helping them connect, 
                  collaborate, and grow together in the digital age of education.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white space-y-6 shadow-large">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Our Impact</h3>
                    <p className="text-white/90">Making a difference in education</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm text-white/90">Schools Connected</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">100+</div>
                    <div className="text-sm text-white/90">Publishers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm text-white/90">Books Available</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm text-white/90">Students Served</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-center group-hover:text-primary transition-colors">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground text-center">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground text-center">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 px-4 md:px-20 bg-primary-light">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the educational transformation. Connect with us today and discover 
            how EduConnect can help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="default" className="w-full sm:w-auto text-base px-8">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                Learn More About Our Services
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

export default About;

