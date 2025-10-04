// Centralized type definitions used across the frontend

export type UserRole = 'Admin' | 'Manager' | 'Employee';
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
export type ApprovalAction = 'Approved' | 'Rejected' | 'RequestedChanges';
export type ApprovalRuleType = 'Sequential' | 'Conditional' | 'Hybrid';

export interface Company {
  id: string;
  name: string;
  countryCode: string; // ISO2
  currency: string; // e.g. 'INR'
  timezone?: string;
  createdAt: string;
  settings: {
    approvalRules: string[];
    exchangeBase?: string;
  };
}

export interface User {
  id: string;
  companyId: string | Company;  // Can be string ID or populated Company object
  email: string;
  fullName: string;
  role: UserRole;
  managerId?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
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
  approverRole: UserRole | 'Finance' | 'Director';
  action: ApprovalAction;
  comment?: string;
  timestamp: string;
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

export interface ApprovalCondition {
  field: string;
  operator: string;
  value: any;
}

export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  sequence: string[]; // role names or user ids
  type: ApprovalRuleType;
  thresholdPercent?: number;
  specificApproverId?: string;
  conditions?: ApprovalCondition[];
  active: boolean;
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  currencies: Record<string, { name: string; symbol?: string }>;
  flags: { svg?: string; png?: string };
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
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
