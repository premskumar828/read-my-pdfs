import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

interface TextDisplayProps {
  text: string;
  title?: string;
  currentPosition?: number;
}

export const TextDisplay = ({ text, title = "Document Content", currentPosition = 0 }: TextDisplayProps) => {
  // Split text into sentences for better highlighting
  const sentences = text.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim());
  
  // Calculate which sentence we're currently at based on character position
  let currentSentenceIndex = 0;
  let charCount = 0;
  
  for (let i = 0; i < sentences.length; i++) {
    charCount += sentences[i].length + 1; // +1 for space
    if (charCount >= currentPosition) {
      currentSentenceIndex = i;
      break;
    }
  }

  if (!text.trim()) {
    return (
      <Card className="h-full">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <BookOpen className="h-12 w-12" />
            <p>Upload a PDF to see the text content here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="bg-reader-bg p-6 rounded-lg text-reader-text leading-relaxed">
            {sentences.map((sentence, index) => (
              <span
                key={index}
                className={
                  index === currentSentenceIndex
                    ? "bg-accent/50 px-1 rounded transition-colors duration-300"
                    : ""
                }
              >
                {sentence}
                {index < sentences.length - 1 && " "}
              </span>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};