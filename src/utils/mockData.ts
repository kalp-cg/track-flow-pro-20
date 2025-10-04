import { Company, User, Expense, ApprovalRule } from '@/types';

export const mockCompany: Company = {
  id: 'c_001',
  name: 'ACME Pvt Ltd',
  countryCode: 'IN',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  createdAt: new Date().toISOString(),
  settings: {
    approvalRules: ['rule_001'],
    exchangeBase: 'INR',
  },
};

export const mockUsers: User[] = [
  {
    id: 'u_admin',
    email: 'admin@acme.com',
    fullName: 'Admin User',
    role: 'Admin',
    companyId: 'c_001',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u_manager',
    email: 'manager@acme.com',
    fullName: 'Manager User',
    role: 'Manager',
    companyId: 'c_001',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u_employee',
    email: 'employee@acme.com',
    fullName: 'Employee User',
    role: 'Employee',
    companyId: 'c_001',
    managerId: 'u_manager',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockExpenses: Expense[] = [
  {
    id: 'exp_001',
    companyId: 'c_001',
    userId: 'u_employee',
    amount: 1500,
    currency: 'INR',
    amountCompanyCurrency: 1500,
    category: 'Travel',
    date: new Date().toISOString(),
    description: 'Taxi to client meeting',
    receiptUrls: [],
    status: 'Pending',
    approvalHistory: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_002',
    companyId: 'c_001',
    userId: 'u_employee',
    amount: 50,
    currency: 'USD',
    amountCompanyCurrency: 4172.5,
    category: 'Meals',
    date: new Date(Date.now() - 86400000).toISOString(),
    description: 'Team lunch',
    receiptUrls: [],
    status: 'Approved',
    approvalHistory: [
      {
        approverId: 'u_manager',
        approverRole: 'Manager',
        action: 'Approved',
        comment: 'Approved',
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockRules: ApprovalRule[] = [
  {
    id: 'rule_001',
    companyId: 'c_001',
    name: 'Standard Approval',
    sequence: ['Manager', 'Admin'],
    type: 'Sequential',
    active: true,
  },
];
