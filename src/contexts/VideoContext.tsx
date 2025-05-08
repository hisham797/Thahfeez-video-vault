import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  featured?: boolean;
}

interface VideoContextType {
  videos: Video[];
  featuredVideos: Video[];
  getVideoById: (id: string) => Video | undefined;
  addVideo: (video: Omit<Video, 'id'>) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  loading: boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        
        // Transform the data to match our Video interface
        const transformedVideos = data.map((video: any) => ({
          id: video._id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnailUrl,
          videoUrl: video.videoUrl,
          duration: video.duration,
          category: video.category,
          featured: video.featured
        }));
        
        setVideos(transformedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getVideoById = (id: string) => {
    return videos.find(video => video.id === id);
  };

  const featuredVideos = videos.filter(video => video.featured);

  const addVideo = (video: Omit<Video, 'id'>) => {
    const newVideo = {
      ...video,
      id: Date.now().toString()
    };
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    const updatedVideos = videos.map(video => 
      video.id === id ? { ...video, ...updates } : video
    );
    setVideos(updatedVideos);
  };

  const deleteVideo = (id: string) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    setVideos(updatedVideos);
  };

  return (
    <VideoContext.Provider value={{ 
      videos, 
      featuredVideos,
      getVideoById,
      addVideo,
      updateVideo,
      deleteVideo,
      loading
    }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
}
