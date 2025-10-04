# ExpenseFlow - Smart Expense Management

A modern, full-featured expense management web application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### Core Functionality
- **🔐 Role-Based Access Control**: Admin, Manager, and Employee roles with distinct permissions
- **📸 OCR Receipt Scanning**: Automatic data extraction from receipts using Tesseract.js
- **💱 Multi-Currency Support**: Real-time currency conversion with exchangerate-api.com
- **✅ Approval Workflows**: Sequential and conditional approval rules
- **📊 Analytics Dashboard**: Track expenses, approvals, and spending trends
- **💾 Offline Support**: Submit expenses offline with automatic sync when reconnected
- **📱 Mobile Responsive**: Fully responsive design for all device sizes

### Technical Features
- React 18 with TypeScript for type-safe development
- Redux Toolkit for predictable state management
- React Query for efficient server state management
- React Hook Form + Zod for robust form validation
- Tailwind CSS with custom design system
- Recharts for beautiful data visualization
- LocalForage for offline persistence

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧪 Demo Accounts

The app includes demo accounts for testing:

- **Admin**: admin@acme.com
- **Manager**: manager@acme.com  
- **Employee**: employee@acme.com
- **Password**: any text (demo mode)

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   └── ui/            # Reusable UI components (shadcn)
├── pages/             # Page components
│   ├── auth/          # Login, Signup
│   ├── Dashboard.tsx  # Main dashboard
│   ├── ExpenseList.tsx
│   └── NewExpense.tsx
├── store/             # Redux store
│   └── slices/        # Redux slices
├── types/             # TypeScript types
├── utils/             # Utility functions
│   ├── api.ts         # API utilities
│   ├── ocr.ts         # OCR functionality
│   └── offlineStorage.ts
└── App.tsx            # Main app component
```

## 🎨 Design System

The application uses a cohesive design system with:
- **Primary**: Deep blue (#2563EB) for trust and professionalism
- **Accent**: Purple (#A855F7) for CTAs and highlights
- **Success**: Green for approvals
- **Warning**: Amber for pending states
- **Semantic tokens**: All colors defined as CSS variables in HSL

## 🔧 Configuration

### Environment Variables

The application supports the following environment variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.trackflow.com
VITE_EXCHANGE_API_KEY=your-exchangerate-api-key

# Third-party Services
VITE_RESTCOUNTRIES_URL=https://restcountries.com/v3.1
VITE_OSS_BUCKET_UPLOAD_URL=your-s3-upload-endpoint

# OCR Configuration
VITE_OCR_MODE=client  # client | server | third_party
```

### API Endpoints

The frontend expects these backend endpoints:

**Authentication**
- `POST /api/auth/signup` - Create account + auto-create company
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh token

**Companies & Users**
- `GET /api/companies/{companyId}` - Get company details
- `GET /api/companies/{companyId}/users` - List users
- `POST /api/companies/{companyId}/users` - Create user

**Expenses**
- `GET /api/companies/{companyId}/expenses` - List expenses
- `POST /api/expenses` - Submit expense (multipart/form-data)
- `POST /api/expenses/{expenseId}/approve` - Approve/reject

**Exchange Rates**
- `GET /api/exchange/latest?base={CURRENCY}` - Get exchange rates

### Company Setup

On first signup:
1. Select your country
2. Company currency is auto-set based on REST Countries API
3. Admin account is created automatically

## 📝 Key Workflows

### Expense Submission
1. Upload receipt (drag-drop or camera)
2. OCR automatically extracts amount, date, vendor
3. Review and edit extracted data
4. Submit for approval

### Approval Process
1. Managers see pending expenses
2. Review receipt, amount, and conversion
3. Approve or reject with comments
4. Admin can configure approval rules

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit
- **Server State**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **OCR**: Tesseract.js
- **File Upload**: React Dropzone
- **Offline**: LocalForage / IndexedDB

## 🎯 Future Enhancements

This V1 includes core features. Future enhancements could include:
- Real backend API integration
- Email notifications
- CSV bulk import/export
- Advanced analytics with filtering
- Rule builder with drag-drop UI
- Mobile app with Capacitor
- Push notifications
- Real-time collaboration

## 📄 License

MIT

---

Built with ❤️ using Lovable
