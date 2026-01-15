import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen, ShoppingCart } from 'lucide-react';

export default function AdminReports() {
  const reportCards = [
    {
      title: 'Total Revenue',
      value: 'NPR 2.4M',
      change: '+18%',
      icon: TrendingUp,
      color: 'bg-primary-light text-primary',
    },
    {
      title: 'Active Users',
      value: '156',
      change: '+12%',
      icon: Users,
      color: 'bg-secondary-light text-secondary',
    },
    {
      title: 'Total Books',
      value: '342',
      change: '+8%',
      icon: BookOpen,
      color: 'bg-accent-light text-accent',
    },
    {
      title: 'Total Orders',
      value: '89',
      change: '+23%',
      icon: ShoppingCart,
      color: 'bg-primary-light text-primary',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive insights and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {report.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-full ${report.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{report.value}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-primary font-medium">{report.change}</span> from last month
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
              Revenue Overview
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
              User Growth
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
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-sm text-muted-foreground mt-1">Active Publishers</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">112</p>
              <p className="text-sm text-muted-foreground mt-1">Registered Schools</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">89%</p>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

