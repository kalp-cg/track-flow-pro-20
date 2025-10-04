import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addExpense } from '@/store/slices/expensesSlice';
import { performOCR } from '@/utils/ocr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';

const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required').transform(val => parseFloat(val)),
  currency: z.string().min(1, 'Currency is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const categories = ['Travel', 'Meals', 'Accommodation', 'Office Supplies', 'Equipment', 'Other'];
const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

const NewExpense = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { company } = useAppSelector((state) => state.company);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: '0' as any,
      currency: company?.currency || 'USD',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 5,
    onDrop: async (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
      
      // Perform OCR on first image
      if (acceptedFiles.length > 0 && !ocrData) {
        setOcrLoading(true);
        try {
          const result = await performOCR(acceptedFiles[0]);
          setOcrData(result);
          
          // Auto-fill form with OCR data
          if (result.parsedAmount) {
            form.setValue('amount', result.parsedAmount.toString() as any);
          }
          if (result.categorySuggestion) {
            form.setValue('category', result.categorySuggestion);
          }
          
          toast.success('Receipt scanned! Review the extracted data.');
        } catch (error) {
          toast.error('OCR failed. Please enter details manually.');
        } finally {
          setOcrLoading(false);
        }
      }
    },
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ExpenseFormData) => {
    const newExpense = {
      id: 'exp_' + Date.now(),
      companyId: user?.companyId || '',
      userId: user?.id || '',
      amount: data.amount,
      currency: data.currency,
      category: data.category,
      date: data.date,
      description: data.description,
      receiptUrls: files.map(f => URL.createObjectURL(f)),
      ocrData: ocrData || undefined,
      status: 'Pending' as const,
      approvalHistory: [],
      createdAt: new Date().toISOString(),
    };

    dispatch(addExpense(newExpense));
    toast.success('Expense submitted successfully!');
    navigate('/app/expenses');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submit Expense</h1>
        <p className="text-muted-foreground mt-1">
          Upload receipts and fill in the details below
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Upload</CardTitle>
            <CardDescription>
              Scan or upload receipts — we'll auto-fill the amount, date & vendor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              {ocrLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Scanning receipt...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Drop receipts here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports PNG, JPG up to 10MB each</p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Receipt ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {ocrData && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">OCR Extracted Data:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {ocrData.parsedAmount && <p>Amount: {ocrData.parsedAmount}</p>}
                  {ocrData.vendor && <p>Vendor: {ocrData.vendor}</p>}
                  {ocrData.categorySuggestion && <p>Category: {ocrData.categorySuggestion}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
            <CardDescription>Enter or verify the expense information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('amount')}
                />
                {form.formState.errors.amount && (
                  <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  value={form.watch('currency')}
                  onValueChange={(value) => form.setValue('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.currency && (
                  <p className="text-sm text-destructive">{form.formState.errors.currency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(value) => form.setValue('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...form.register('date')}
                />
                {form.formState.errors.date && (
                  <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add any additional details..."
                rows={3}
                {...form.register('description')}
              />
              <p className="text-xs text-muted-foreground">
                {form.watch('description')?.length || 0} / 1000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/app/expenses')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            Submit Expense
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewExpense;
