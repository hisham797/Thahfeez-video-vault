import React, { useState } from 'react';
import { Clock, Play, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VideoPlayer } from './VideoPlayer';
import { toast } from './ui/use-toast';

interface VideoCardAdminProps {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  featured: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VideoCardAdmin: React.FC<VideoCardAdminProps> = ({
  id,
  title,
  description,
  category,
  thumbnailUrl,
  videoUrl,
  duration,
  featured,
  onEdit,
  onDelete,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<{ url: string } | null>(null);

  const handlePreview = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Invalid video ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // If we have a direct video URL, use it
      if (videoUrl) {
        setVideoData({ url: videoUrl });
        setPreviewOpen(true);
        return;
      }

      // Otherwise fetch from API
      const response = await fetch(`/api/admin/videos/${id}/preview`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video');
      }

      if (!data.url) {
        throw new Error('Video URL not found');
      }

      setVideoData({ url: data.url });
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error previewing video:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to preview video",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPreviewOpen(false);
    setVideoData(null);
  };

  return (
    <>
      <div className="flex flex-col rounded-lg overflow-hidden bg-[#1A1F2C] h-full">
        <div 
          className="relative group cursor-pointer" 
          onClick={handlePreview}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
              <Clock className="h-12 w-12 text-gray-500" />
            </div>
          )}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          )}
          {featured && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-md">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white bg-opacity-80 rounded-full p-3">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
              ) : (
                <Play className="h-8 w-8 text-gray-800" />
              )}
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-purple-400 mb-2">{category}</p>
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
          
          <div className="mt-auto flex justify-between">
            <button
              onClick={() => onEdit(id)}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Edit size={18} className="mr-1" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(id)}
              className="flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={18} className="mr-1" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[800px] bg-[#1A1F2C] p-1 border-gray-800">
          <DialogTitle className="sr-only">Video Preview: {title}</DialogTitle>
          <div className="w-full">
            {videoData && (
              <VideoPlayer 
                title={title} 
                videoUrl={videoData.url} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCardAdmin;
