import { NavLink } from '@/components/NavLink';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  FileText,
  CheckSquare,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/books', label: 'All Books', icon: BookOpen },
  { to: '/admin/orders', label: 'All Orders', icon: ShoppingCart },
];

const publisherLinks = [
  { to: '/publisher', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/publisher/books', label: 'My Books', icon: BookOpen },
  { to: '/publisher/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/publisher/schools', label: 'Schools', icon: Users },
  { to: '/publisher/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/publisher/progress', label: 'Progress', icon: CheckSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const schoolLinks = [
  { to: '/school', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/school/books', label: 'All Books', icon: BookOpen },
  { to: '/school/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/school/orders', label: 'My Orders', icon: FileText },
  { to: '/school/progress', label: 'Progress', icon: CheckSquare },
  { to: '/school/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  const { user } = useAuthStore();

  const links = 
    user?.role === 'admin' ? adminLinks :
    user?.role === 'publisher' ? publisherLinks :
    schoolLinks;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="EduConnect Logo" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduConnect
            </h1>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to.split('/').length === 2}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground",
              "transition-all duration-200",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-soft"
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
