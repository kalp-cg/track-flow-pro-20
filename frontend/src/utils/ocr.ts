// OCR implementation kept at end of file
import { createWorker, Worker } from 'tesseract.js';
import { OCRData } from '@/types';

export const performOCR = async (imageFile: File): Promise<OCRData> => {
  const worker: Worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageFile);
    
    // Parse the OCR text for common expense data
    const parsedData = parseExpenseText(text);
    
    return {
      rawText: text,
      ...parsedData,
    };
  } finally {
    await worker.terminate();
  }
};

const parseExpenseText = (text: string): Partial<OCRData> => {
  const result: Partial<OCRData> = {};
  
  // Try to find amount (looks for currency symbols followed by numbers)
  const amountMatch = text.match(/(?:₹|Rs\.?|USD|\$|EUR|€)\s*([0-9,]+\.?\d*)/i);
  if (amountMatch) {
    result.parsedAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }
  
  // Try to find date (common date formats)
  const dateMatch = text.match(/(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/);
  if (dateMatch) {
    result.parsedDate = dateMatch[1];
  }
  
  // Try to find vendor name (usually at the top, capitalized)
  const lines = text.split('\n').filter(line => line.trim().length > 2);
  if (lines.length > 0) {
    result.vendor = lines[0].trim();
  }
  
  // Simple category suggestion based on keywords
  const lowerText = text.toLowerCase();
  if (lowerText.includes('taxi') || lowerText.includes('uber') || lowerText.includes('transport')) {
    result.categorySuggestion = 'Travel';
  } else if (lowerText.includes('restaurant') || lowerText.includes('food') || lowerText.includes('meal')) {
    result.categorySuggestion = 'Meals';
  } else if (lowerText.includes('hotel') || lowerText.includes('accommodation')) {
    result.categorySuggestion = 'Accommodation';
  } else if (lowerText.includes('office') || lowerText.includes('supplies')) {
    result.categorySuggestion = 'Office Supplies';
  }
  
  return result;
};
