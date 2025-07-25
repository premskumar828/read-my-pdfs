import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Settings,
  Loader2
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  progress: number;
  duration: number;
  onSeek: (position: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  hasAudio: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const AudioControls = ({
  isPlaying,
  isLoading,
  onPlay,
  onPause,
  onStop,
  progress,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  playbackRate,
  onPlaybackRateChange,
  hasAudio,
  apiKey,
  onApiKeyChange
}: AudioControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <Card className="border-audio-secondary bg-card">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-progress-bg rounded-full h-2">
              <div 
                className="bg-progress-fill h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onStop}
              disabled={!hasAudio || isLoading}
              className="h-12 w-12 p-0"
            >
              <Square className="h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              onClick={isPlaying ? onPause : onPlay}
              disabled={!hasAudio || isLoading}
              className="h-16 w-16 p-0 bg-audio-primary hover:bg-audio-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>

            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">ElevenLabs API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => onApiKeyChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Volume: {Math.round(volume * 100)}%</Label>
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(value) => onVolumeChange(value[0] / 100)}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Speed: {playbackRate}x</Label>
                    <Slider
                      value={[playbackRate * 100]}
                      onValueChange={(value) => onPlaybackRateChange(value[0] / 100)}
                      min={50}
                      max={200}
                      step={25}
                      className="mt-2"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {!apiKey && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Add your ElevenLabs API key in settings to enable text-to-speech
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};