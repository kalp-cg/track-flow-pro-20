import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, MessageSquare, Receipt } from 'lucide-react';
import type { Expense } from '@/types';

const mockPendingExpenses: (Expense & { submittedBy: { name: string; email: string } })[] = [
  {
    id: 'exp_1',
    description: 'Client Dinner - Business dinner with potential client',
    amount: 150.00,
    currency: 'USD',
    category: 'Meals & Entertainment',
    date: '2024-01-15',
    status: 'Pending',
    receiptUrls: ['/api/files/receipt1.jpg'],
    approvalHistory: [],
    submittedBy: { name: 'John Doe', email: 'john@company.com' },
    userId: 'user_1',
    companyId: 'company_1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

const Approvals = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'processed'>('pending');

  // Mock data - replace with actual data from useExpenses hook
  const mockPendingApprovals = [
    {
      id: 'exp_001',
      amount: 150.00,
      currency: 'USD',
      category: 'Travel',
      submitter: 'John Doe',
      submittedAt: '2025-10-04T10:00:00Z',
      description: 'Taxi to airport',
      receiptUrls: ['receipt1.jpg'],
    },
    {
      id: 'exp_002',
      amount: 85.50,
      currency: 'USD',
      category: 'Meals',
      submitter: 'Jane Smith',
      submittedAt: '2025-10-03T14:30:00Z',
      description: 'Client lunch meeting',
      receiptUrls: ['receipt2.jpg'],
    },
  ];

  if (user?.role !== 'Manager' && user?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view approvals.</p>
        </div>
      </div>
    );
  }

  const handleApprove = async (expenseId: string) => {
    // TODO: Implement approval logic using useExpenses mutation
    console.log('Approving expense:', expenseId);
  };

  const handleReject = async (expenseId: string) => {
    // TODO: Implement rejection logic using useExpenses mutation
    console.log('Rejecting expense:', expenseId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">Review and approve expense submissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('pending')}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Pending ({mockPendingApprovals.length})
          </Button>
          <Button
            variant={selectedTab === 'processed' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('processed')}
          >
            Processed
          </Button>
        </div>
      </div>

      {selectedTab === 'pending' && (
        <div className="grid gap-4">
          {mockPendingApprovals.map((expense) => (
            <Card key={expense.id} className="p-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      {expense.category} - ${expense.amount}
                    </CardTitle>
                    <CardDescription>
                      Submitted by {expense.submitter} • {new Date(expense.submittedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{expense.description}</p>
                  </div>
                  
                  {expense.receiptUrls.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Receipts</p>
                      <div className="flex gap-2">
                        {expense.receiptUrls.map((url, index) => (
                          <div key={index} className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                            <Receipt className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(expense.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(expense.id)}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockPendingApprovals.length === 0 && (
            <Card className="p-8">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No pending approvals at the moment.</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {selectedTab === 'processed' && (
        <Card className="p-8">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processed Approvals</h3>
            <p className="text-muted-foreground">View your approval history here.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Approvals;