import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface PDFReaderState {
  file: File | null;
  text: string;
  isLoading: boolean;
  error: string | null;
  currentPosition: number;
  apiKey: string;
}

export const usePDFReader = () => {
  const [state, setState] = useState<PDFReaderState>({
    file: null,
    text: '',
    isLoading: false,
    error: null,
    currentPosition: 0,
    apiKey: localStorage.getItem('elevenlabs-api-key') || ''
  });

  const extractTextFromPDF = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Import PDF.js
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
      }

      if (!fullText.trim()) {
        throw new Error('No text found in PDF. The PDF might be image-based or protected.');
      }

      setState(prev => ({
        ...prev,
        file,
        text: fullText.trim(),
        isLoading: false,
        currentPosition: 0
      }));

      toast({
        title: "PDF processed successfully",
        description: `Extracted text from ${pdf.numPages} pages`
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process PDF';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Error processing PDF",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, []);

  const clearFile = useCallback(() => {
    setState(prev => ({
      ...prev,
      file: null,
      text: '',
      error: null,
      currentPosition: 0
    }));
  }, []);

  const updatePosition = useCallback((position: number) => {
    setState(prev => ({ ...prev, currentPosition: position }));
  }, []);

  const setApiKey = useCallback((key: string) => {
    localStorage.setItem('elevenlabs-api-key', key);
    setState(prev => ({ ...prev, apiKey: key }));
  }, []);

  return {
    ...state,
    extractTextFromPDF,
    clearFile,
    updatePosition,
    setApiKey
  };
};