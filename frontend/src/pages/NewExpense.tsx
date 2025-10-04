import { useState } from 'react';
import { useOCR } from '@/hooks/useOCR';
import { uploadFile } from '@/utils/upload';
import { useExpenses } from '@/hooks/queries/useExpenses';

const NewExpense = () => {
  const { recognize, loading: ocrLoading, text: ocrText } = useOCR();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const expenses = useExpenses(''); // companyId should be from auth/company context
  const submit = expenses.submit;

  const onFile = async (f?: File) => {
    if (!f) return;
    setFile(f);
    try {
      await recognize(f);
    } catch (e) {
      // ignore for now
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    // 1) request signed upload URL from backend (stubbed)
    const uploadUrlResponse = '/api/upload-url'; // TODO: replace with api call

    try {
      const { url } = await uploadFile(file, uploadUrlResponse, (loaded, total) => {
        setUploadProgress(Math.round((loaded / total) * 100));
      });

      const fd = new FormData();
      fd.append('amount', '0');
      fd.append('currency', 'USD');
      fd.append('date', new Date().toISOString());
      fd.append('receipt', file, file.name);

      submit.mutate(fd);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">New Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <label className="block">
          <span>Receipt</span>
          <input
            type="file"
            accept="image/*"
            onChange={(ev) => onFile(ev.target.files?.[0])}
            aria-describedby="receipt-desc"
          />
          <span id="receipt-desc" className="sr-only">Upload an image of your receipt. We will attempt OCR.</span>
        </label>

        {ocrLoading && <div>Running OCR...</div>}
        {ocrText && (
          <div>
            <h2 className="font-medium">OCR Preview</h2>
            <pre className="whitespace-pre-wrap">{ocrText}</pre>
          </div>
        )}

        <div>
          <button type="submit" className="btn btn-primary" disabled={submit.isPending}>
            Submit
          </button>
          {uploadProgress > 0 && <span className="ml-2">Uploading: {uploadProgress}%</span>}
        </div>
      </form>
    </main>
  );
};
export default NewExpense;
