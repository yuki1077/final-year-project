import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, BookOpen, ShoppingCart, DollarSign } from 'lucide-react';

export default function PublisherAnalytics() {
  const analyticsCards = [
    {
      title: 'Total Revenue',
      value: 'NPR 845K',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-primary-light text-primary',
    },
    {
      title: 'Books Sold',
      value: '234',
      change: '+12%',
      icon: BookOpen,
      color: 'bg-secondary-light text-secondary',
    },
    {
      title: 'Active Orders',
      value: '12',
      change: '+5',
      icon: ShoppingCart,
      color: 'bg-accent-light text-accent',
    },
    {
      title: 'Growth Rate',
      value: '23%',
      change: '+3%',
      icon: TrendingUp,
      color: 'bg-primary-light text-primary',
    },
  ];

  const topBooks = [
    { title: 'Mathematics Grade 8', sales: 45, revenue: 22500 },
    { title: 'Science Grade 9', sales: 32, revenue: 17600 },
    { title: 'English Grade 7', sales: 28, revenue: 13440 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your book performance and sales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-full ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-primary font-medium">{card.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Sales Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Chart visualization will be implemented here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Chart visualization will be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Top Performing Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{book.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {book.sales} copies sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">NPR {book.revenue}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

