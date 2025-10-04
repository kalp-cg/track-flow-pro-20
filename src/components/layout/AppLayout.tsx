import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Settings, 
  LogOut, 
  User,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Dashboard from '@/pages/Dashboard';
import ExpenseList from '@/pages/ExpenseList';
import NewExpense from '@/pages/NewExpense';

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { company } = useAppSelector((state) => state.company);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
    { icon: Receipt, label: 'Expenses', path: '/app/expenses' },
    ...(user?.role === 'Manager' || user?.role === 'Admin' ? [
      { icon: CheckCircle, label: 'Approvals', path: '/app/approvals' }
    ] : []),
    ...(user?.role === 'Admin' ? [
      { icon: Users, label: 'Users', path: '/app/users' },
      { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
      { icon: Settings, label: 'Settings', path: '/app/settings' }
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
              <span className="text-xl font-bold">ExpenseFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    window.location.pathname === item.path && "text-foreground bg-muted"
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {company && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
                <span className="font-medium">{company.currency}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{company.name}</span>
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                    {user?.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="expenses" element={<ExpenseList />} />
          <Route path="expenses/new" element={<NewExpense />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppLayout;
