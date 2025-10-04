import { useState, useCallback } from 'react';
import { performOCR } from '@/utils/ocr';

export const useOCR = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognize = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const res = await performOCR(file);
      setText(res.rawText || '');
      setLoading(false);
      return res;
    } catch (e: any) {
      setError(e.message || 'OCR failed');
      setLoading(false);
      throw e;
    }
  }, []);

  return { recognize, loading, text, error } as const;
};
