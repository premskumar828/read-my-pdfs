import { PDFUpload } from "@/components/PDFUpload";
import { TextDisplay } from "@/components/TextDisplay";
import { AudioControls } from "@/components/AudioControls";
import { usePDFReader } from "@/hooks/usePDFReader";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Button } from "@/components/ui/button";
import { FileAudio, BookOpen } from "lucide-react";

const Index = () => {
  const {
    file,
    text,
    isLoading: pdfLoading,
    error,
    currentPosition,
    apiKey,
    extractTextFromPDF,
    clearFile,
    updatePosition,
    setApiKey
  } = usePDFReader();

  const {
    isPlaying,
    isLoading: audioLoading,
    progress,
    duration,
    volume,
    playbackRate,
    hasAudio,
    convertTextToSpeech,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate
  } = useTextToSpeech(apiKey, updatePosition);

  const handleGenerateAudio = () => {
    if (text && apiKey) {
      convertTextToSpeech(text);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileAudio className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PDF Voice Reader</h1>
                <p className="text-sm text-muted-foreground">
                  Convert any PDF to high-quality audio
                </p>
              </div>
            </div>
            {text && !hasAudio && apiKey && (
              <Button onClick={handleGenerateAudio} disabled={audioLoading}>
                <BookOpen className="h-4 w-4 mr-2" />
                Generate Audio
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-6">
            <PDFUpload
              onFileSelect={extractTextFromPDF}
              isLoading={pdfLoading}
              selectedFile={file}
              onClearFile={clearFile}
            />
            
            <AudioControls
              isPlaying={isPlaying}
              isLoading={audioLoading}
              onPlay={play}
              onPause={pause}
              onStop={stop}
              progress={progress}
              duration={duration}
              onSeek={seek}
              volume={volume}
              onVolumeChange={setVolume}
              playbackRate={playbackRate}
              onPlaybackRateChange={setPlaybackRate}
              hasAudio={hasAudio}
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
            />
          </div>

          {/* Right Column - Text Display */}
          <div className="h-full">
            <TextDisplay
              text={text}
              title={file?.name || "Document Content"}
              currentPosition={currentPosition}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
