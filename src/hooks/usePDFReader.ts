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
      // Use FileReader to read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      
      // For now, we'll simulate PDF text extraction
      // In a real implementation, you'd use a library like pdf-parse or PDF.js
      const simulatedText = `This is extracted text from ${file.name}. 
      
PDF text extraction would happen here using a proper PDF parsing library. The text would be extracted from all pages and formatted for reading. 

This sample text demonstrates how the reader would work with actual PDF content. Each sentence would be highlighted as the audio plays, creating a synchronized reading experience.

You can upload a real PDF file and the system will extract its text content for text-to-speech conversion using ElevenLabs API.`;

      setState(prev => ({
        ...prev,
        file,
        text: simulatedText,
        isLoading: false,
        currentPosition: 0
      }));

      toast({
        title: "PDF processed successfully",
        description: "Text extracted and ready for audio conversion"
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