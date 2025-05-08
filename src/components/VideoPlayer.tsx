import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Fullscreen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ 
  title, 
  videoUrl, 
  onNext, 
  onPrevious, 
  onProgress,
  onComplete 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeId, setYoutubeId] = useState("");
  const [playerReady, setPlayerReady] = useState(false);
  const youtubePlayer = useRef<any>(null);

  useEffect(() => {
    // Check if videoUrl is a YouTube URL and extract the video ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl?.match(youtubeRegex);
    
    if (match && match[1]) {
      setIsYouTube(true);
      setYoutubeId(match[1]);
    } else {
      setIsYouTube(false);
      setYoutubeId("");
    }
  }, [videoUrl]);

  // Load YouTube API
  useEffect(() => {
    if (!isYouTube || !youtubeId) return;

    // Only load the API once
    if (window.YT) {
      setPlayerReady(true);
      return;
    }
    
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      setPlayerReady(true);
    };

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, [isYouTube, youtubeId]);

  // Setup YouTube player when API is ready
  useEffect(() => {
    if (!isYouTube || !youtubeId || !playerReady || !window.YT) return;
    
    const ytContainer = document.getElementById('youtube-player');
    if (!ytContainer) return;

    // Only create new player if it doesn't exist
    if (!youtubePlayer.current) {
    try {
      youtubePlayer.current = new window.YT.Player('youtube-player', {
        videoId: youtubeId,
        playerVars: {
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
            modestbranding: 1,
            autoplay: 0
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
              // Don't show toast on initial load
              if (youtubePlayer.current?.getPlayerState() !== window.YT.PlayerState.PLAYING) {
            toast({
              title: "Video loaded",
              description: `Now playing: ${title}`
            });
              }
          },
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsPlaying(true);
              } else if (event.data === 2) {
              setIsPlaying(false);
              } else if (event.data === 0) {
              setIsPlaying(false);
              setProgress(100);
              if (onComplete) onComplete();
              toast({
                title: "Video completed",
                description: "You've completed watching this video."
              });
            }
          }
        }
      });
    } catch (error) {
      console.error("YouTube player initialization error:", error);
      }
    } else {
      // If player exists, just load the new video without resetting state
      try {
        const currentState = youtubePlayer.current.getPlayerState();
        const wasPlaying = currentState === window.YT.PlayerState.PLAYING;
        const currentTime = youtubePlayer.current.getCurrentTime();
        
        youtubePlayer.current.loadVideoById({
          videoId: youtubeId,
          startSeconds: currentTime,
          autoplay: wasPlaying ? 1 : 0
        });
      } catch (error) {
        console.error("YouTube video load error:", error);
      }
    }

    // Start YouTube progress tracker
    const interval = setInterval(() => {
      if (youtubePlayer.current && typeof youtubePlayer.current.getCurrentTime === 'function') {
        try {
          const currentTime = youtubePlayer.current.getCurrentTime();
          const duration = youtubePlayer.current.getDuration();
          if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            setProgress(progressPercent);
            setCurrentTime(currentTime);
            if (onProgress) onProgress(progressPercent);
          }
        } catch (error) {
          console.error("YouTube progress tracking error:", error);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isYouTube, youtubeId, playerReady, title, onComplete, onProgress]);

  // Handle regular video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;
    
    const handleTimeUpdate = () => {
      if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
        setCurrentTime(video.currentTime);
        if (onProgress) onProgress(progressPercent);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Don't show toast on initial load
      if (!video.hasAttribute('data-initial-load')) {
      toast({
        title: "Video loaded",
        description: `Now playing: ${title}`
      });
        video.setAttribute('data-initial-load', 'true');
      }
    };
    
    const handleVideoEnd = () => {
      setIsPlaying(false);
      setProgress(100);
      if (onComplete) onComplete();
      toast({
        title: "Video completed",
        description: "You've completed watching this video."
      });
    };
    
    // Only add event listeners if they haven't been added
    if (!video.hasAttribute('data-listeners-added')) {
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleVideoEnd);
      video.setAttribute('data-listeners-added', 'true');
    }
    
    return () => {
      // Don't remove listeners on cleanup to prevent reload
      // They will be cleaned up when the component unmounts
    };
  }, [title, onComplete, onProgress]);

  // Cleanup YouTube player only on component unmount
  useEffect(() => {
    return () => {
      if (youtubePlayer.current && typeof youtubePlayer.current.destroy === 'function') {
        try {
          youtubePlayer.current.destroy();
        } catch (error) {
          console.error("YouTube player destruction error:", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    if (isYouTube && youtubePlayer.current) {
      try {
        if (isPlaying) {
          youtubePlayer.current.pauseVideo();
        } else {
          youtubePlayer.current.playVideo();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("YouTube play/pause error:", error);
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    
    try {
      if (isPlaying) {
        video.pause();
      } else {
        // Store current time and play state
        const currentTime = video.currentTime;
        const wasPlaying = !video.paused;
        
        // Play the video
        video.play().then(() => {
          // Restore time if it was changed
          if (video.currentTime !== currentTime) {
            video.currentTime = currentTime;
          }
          // Ensure play state is maintained
          if (wasPlaying && video.paused) {
        video.play();
          }
        });
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Video play/pause error:", error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    
    if (!progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    if (isYouTube && youtubePlayer.current) {
      try {
        const newTime = clickPosition * duration;
        const wasPlaying = youtubePlayer.current.getPlayerState() === window.YT.PlayerState.PLAYING;
        
        // Seek to new position while maintaining play state
        youtubePlayer.current.seekTo(newTime, true);
        if (wasPlaying) {
          youtubePlayer.current.playVideo();
        }
      } catch (error) {
        console.error("YouTube seek error:", error);
      }
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    try {
      const wasPlaying = !video.paused;
      const newTime = clickPosition * video.duration;
      
      // Store current time
      const currentTime = video.currentTime;
      
      // Set new time
      video.currentTime = newTime;
      setProgress(clickPosition * 100);
      setCurrentTime(newTime);
      
      // Maintain play state
      if (wasPlaying) {
        video.play().then(() => {
          // Ensure time is correct
          if (video.currentTime !== newTime) {
            video.currentTime = newTime;
          }
        });
      }
    } catch (error) {
      console.error("Video seek error:", error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      // If no onPrevious handler, go to beginning of current video
      if (isYouTube && youtubePlayer.current) {
        try {
          youtubePlayer.current.seekTo(0);
          setProgress(0);
          setCurrentTime(0);
          if (!isPlaying) {
            youtubePlayer.current.playVideo();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error("YouTube previous error:", error);
        }
      } else if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
          setProgress(0);
          setCurrentTime(0);
          if (!isPlaying) {
            videoRef.current.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error("Video previous error:", error);
        }
      }
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      toast({
        title: "End of playlist",
        description: "There are no more videos in this playlist."
      });
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = videoContainerRef.current;
    
    if (!videoContainer) return;
    
    try {
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
          toast({
            title: "Fullscreen error",
            description: `Error attempting to enable fullscreen: ${err.message}`,
            variant: "destructive"
          });
        });
      } else {
        document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen toggle error:", error);
    }
  };

  return (
    <div 
      ref={videoContainerRef} 
      className="video-player bg-black rounded-lg overflow-hidden shadow-xl relative"
    >
      {/* Video */}
      <div className="relative aspect-video">
        {isYouTube ? (
          <div id="youtube-player" className="w-full h-full"></div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            poster={isPlaying ? undefined : "/lovable-uploads/368b5a35-0a2d-486c-924e-19b4b78d59bc.png"}
            controls={false}
            src={videoUrl}
          />
        )}
        
        {/* Play/Pause overlay button */}
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
          onClick={togglePlay}
        >
          <button 
            className="bg-white bg-opacity-70 hover:bg-opacity-90 w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
          </button>
        </div>
      </div>
      
      {/* Controls */}
      <div className="p-3 bg-brandDark">
        {/* Progress bar */}
        <div 
          ref={progressRef}
          className="h-2 bg-gray-700 rounded-full cursor-pointer mb-2"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-brandBlue to-brandCyan rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Time display and controls */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">{formatTime(currentTime)}</span>
          
          {/* Control buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrevious}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              onClick={handleNext}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Next"
            >
              <SkipForward size={20} />
            </button>
            
            <button 
              onClick={toggleFullscreen}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Fullscreen size={20} />
            </button>
          </div>
          
          <span className="text-sm text-gray-300">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default VideoPlayer;
