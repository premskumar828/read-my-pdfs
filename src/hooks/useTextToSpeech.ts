import { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  volume: number;
  playbackRate: number;
  hasAudio: boolean;
}

export const useTextToSpeech = (apiKey: string, onPositionUpdate?: (position: number) => void) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    progress: 0,
    duration: 0,
    volume: 0.7,
    playbackRate: 1.0,
    hasAudio: false
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const convertTextToSpeech = useCallback(async (text: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your ElevenLabs API key in the settings",
        variant: "destructive"
      });
      return;
    }

    setAudioState(prev => ({ ...prev, isLoading: true }));

    try {
      // ElevenLabs TTS API call
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text.slice(0, 2500), // Limit text length for demo
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and configure audio element
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(audioUrl);
      audio.volume = audioState.volume;
      audio.playbackRate = audioState.playbackRate;
      
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => {
        setAudioState(prev => ({
          ...prev,
          duration: audio.duration,
          hasAudio: true,
          isLoading: false
        }));
      });

      audio.addEventListener('timeupdate', () => {
        const progress = audio.currentTime;
        setAudioState(prev => ({ ...prev, progress }));
        
        // Calculate text position based on audio progress
        if (onPositionUpdate && audio.duration > 0) {
          const textPosition = (progress / audio.duration) * text.length;
          onPositionUpdate(Math.floor(textPosition));
        }
      });

      audio.addEventListener('ended', () => {
        setAudioState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      });

      toast({
        title: "Audio ready",
        description: "Text has been converted to speech"
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to convert text to speech';
      setAudioState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Text-to-speech failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [apiKey, audioState.volume, audioState.playbackRate, onPositionUpdate]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
    }
  }, []);

  const seek = useCallback((position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
      setAudioState(prev => ({ ...prev, progress: position }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setAudioState(prev => ({ ...prev, volume }));
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setAudioState(prev => ({ ...prev, playbackRate: rate }));
  }, []);

  return {
    ...audioState,
    convertTextToSpeech,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate
  };
};