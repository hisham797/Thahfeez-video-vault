"use client"
import React, { useState, useEffect } from 'react';
import { AdminLayout } from "../../../components/AdminLayout";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import VideoUploadFormWithDuration from "../../../components/VideoUploadFormWithDuration";
import { useToast } from "../../../hooks/use-toast";
import VideoCardAdmin from "../../../components/VideoCardAdmin";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadToImageKit } from '@/lib/imagekit';
import { Plus, Loader2 } from "lucide-react";

interface Video {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VideoFormData {
  _id?: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  featured: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  thumbnailFile: File | null;
  videoFile: File | null;
}

const AdminVideos = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    category: '',
    duration: '',
    featured: false,
    thumbnailUrl: '',
    videoUrl: '',
    thumbnailFile: null,
    videoFile: null,
  });
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/login');
    } else {
      fetchVideos();
    }
  }, [user, router]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/videos');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch videos');
      }

      // Ensure each video has a valid _id
      const formattedVideos = data.map((video: any) => ({
        ...video,
        _id: video._id || video.id // Handle both _id and id formats
      }));

      setVideos(formattedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch videos');
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type === 'thumbnail' ? 'thumbnailFile' : 'videoFile']: file
      }));
    }
  };

  const handleSubmit = async (formData: VideoFormData) => {
    setIsSubmitting(true);

    try {
      // Upload thumbnail first
      let thumbnailUrl = formData.thumbnailUrl;
      if (formData.thumbnailFile) {
        const fileExtension = formData.thumbnailFile.name.split('.').pop() || 'jpg';
        const thumbnailResponse = await uploadToImageKit({
          file: formData.thumbnailFile,
          fileName: `${formData.title.toLowerCase().replace(/\s+/g, '-')}-thumbnail.${fileExtension}`,
          type: 'thumbnail'
        });
        if (thumbnailResponse && thumbnailResponse.url) {
          thumbnailUrl = thumbnailResponse.url;
        }
      }

      // Upload video
      let videoUrl = formData.videoUrl;
      if (formData.videoFile) {
        const fileExtension = formData.videoFile.name.split('.').pop() || 'mp4';
        const videoResponse = await uploadToImageKit({
          file: formData.videoFile,
          fileName: `${formData.title.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`,
          type: 'video'
        });
        if (videoResponse && videoResponse.url) {
          videoUrl = videoResponse.url;
        }
      }

      // Create video in database
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          thumbnailUrl,
          videoUrl,
          duration: formData.duration,
          featured: formData.featured,
        }),
      });

      if (!response.ok) throw new Error('Failed to create video');

      toast({
        title: "Success",
        description: "Video added successfully"
    });
    
    setIsFormOpen(false);
      fetchVideos(); // Refresh the video list
    } catch (error) {
      console.error('Error adding video:', error);
    toast({
        title: "Error",
        description: "Failed to add video",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVideo = async (data: VideoFormData) => {
    if (!data._id) return;
    
    try {
      const response = await fetch(`/api/admin/videos/${data._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update video');

      setVideos(prev => prev.map(video => 
        video._id === data._id ? { ...video, ...data } : video
      ));
    
    setEditingVideo(null);
    setIsFormOpen(false);
    toast({
        title: "Success",
        description: "Video has been updated successfully.",
    });
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        title: "Error",
        description: "Failed to update video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete video');

      setVideos(prev => prev.filter(video => video._id !== id));
      toast({
        title: "Success",
        description: "Video has been deleted successfully.",
      });
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete video",
        variant: "destructive"
    });
    }
  };

  const openEditDialog = (id: string) => {
    const videoToEdit = videos.find(video => video._id === id);
    if (videoToEdit) {
      router.push(`/admin/videos/edit/${id}`);
    }
  };

  const handleVideoSubmit = async (data: { videoUrl: string; thumbnailUrl: string; duration: number }) => {
    try {
      // Here you would typically save the video data to your database
      console.log('Video data:', data);
      setIsUploadFormOpen(false);
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  if (!user?.isAdmin) {
    return null;
    }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
    }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-500 p-4">
          Error loading videos: {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Manage Videos</h1>
          
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Video
              </Button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No videos found. Add your first video!</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCardAdmin
                key={`video-${video._id}`}
                id={video._id}
              title={video.title}
              description={video.description}
              category={video.category}
              thumbnailUrl={video.thumbnailUrl}
              videoUrl={video.videoUrl}
              duration={video.duration}
              featured={video.featured}
              onEdit={openEditDialog}
              onDelete={handleDeleteVideo}
            />
          ))}
        </div>
        )}

        <VideoUploadFormWithDuration
          isOpen={isFormOpen}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminVideos;