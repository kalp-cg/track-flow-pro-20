import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { mockExpenses } from '@/utils/mockData';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { company } = useAppSelector((state) => state.company);

  const stats = {
    totalExpenses: mockExpenses.length,
    pending: mockExpenses.filter(e => e.status === 'Pending').length,
    approved: mockExpenses.filter(e => e.status === 'Approved').length,
    totalAmount: mockExpenses.reduce((sum, e) => sum + (e.amountCompanyCurrency || e.amount), 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.fullName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'Admin' && 'Manage your company expenses and approvals'}
          {user?.role === 'Manager' && 'Review and approve team expenses'}
          {user?.role === 'Employee' && 'Track and submit your expenses'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExpenses}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {company?.currency} {stats.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest expense submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExpenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{expense.category}</p>
                    <p className="text-sm text-muted-foreground">{expense.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {expense.currency} {expense.amount}
                    </p>
                    <div className={`text-xs ${
                      expense.status === 'Approved' ? 'text-success' :
                      expense.status === 'Pending' ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {expense.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/app/expenses/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">Submit Expense</p>
                <p className="text-sm text-muted-foreground">Create new expense report</p>
              </div>
            </Link>

            {(user?.role === 'Manager' || user?.role === 'Admin') && (
              <Link
                to="/app/approvals"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-success flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success-foreground" />
                </div>
                <div>
                  <p className="font-medium">Review Approvals</p>
                  <p className="text-sm text-muted-foreground">{stats.pending} pending</p>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
