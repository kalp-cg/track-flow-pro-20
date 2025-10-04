export type UserRole = 'Admin' | 'Manager' | 'Employee';

export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Escalated';

export type ApprovalAction = 'Approved' | 'Rejected' | 'RequestedChanges';

export type ApprovalRuleType = 'Sequential' | 'Conditional' | 'Hybrid';

export interface Company {
  id: string;
  name: string;
  countryCode: string;
  currency: string;
  timezone?: string;
  createdAt: string;
  settings: {
    approvalRules: string[];
    exchangeBase?: string;
  };
}

export interface User {
  id: string;
  companyId: string;
  email: string;
  fullName: string;
  role: UserRole;
  managerId?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Expense {
  id: string;
  companyId: string;
  userId: string;
  amount: number;
  currency: string;
  amountCompanyCurrency?: number;
  category: string;
  date: string;
  description?: string;
  receiptUrls: string[];
  ocrData?: OCRData;
  status: ExpenseStatus;
  approvalHistory: ApprovalRecord[];
  createdAt: string;
  updatedAt?: string;
}

export interface OCRData {
  rawText: string;
  parsedAmount?: number;
  parsedDate?: string;
  vendor?: string;
  categorySuggestion?: string;
}

export interface ApprovalRecord {
  approverId: string;
  approverRole: UserRole;
  action: ApprovalAction;
  comment?: string;
  timestamp: string;
}

export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  sequence: string[];
  type: ApprovalRuleType;
  thresholdPercent?: number;
  specificApproverId?: string;
  conditions?: ApprovalCondition[];
  active: boolean;
}

export interface ApprovalCondition {
  field: string;
  operator: string;
  value: any;
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  flags: {
    svg: string;
    png: string;
  };
}

export interface ExchangeRates {
  base: string;
  rates: {
    [key: string]: number;
  };
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'expense_approved' | 'expense_rejected' | 'approval_pending' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
