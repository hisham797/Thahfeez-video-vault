'use client';

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Loader, Check, FileImage, Video as VideoIcon, Play, Upload, X } from 'lucide-react';
import { toast } from './ui/use-toast';
import { upload } from "@imagekit/next";

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

interface VideoUploadFormProps {
  onSubmit: (data: VideoFormData) => Promise<void>;
  initialData?: VideoFormData;
  onCancel?: () => void;
  isOpen: boolean;
}

const VideoUploadFormWithDuration: React.FC<VideoUploadFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    duration: initialData?.duration || '',
    featured: initialData?.featured || false,
    thumbnailUrl: initialData?.thumbnailUrl || '',
    videoUrl: initialData?.videoUrl || '',
    thumbnailFile: null,
    videoFile: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnailFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, videoFile: file }));
      setVideoFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Validate form data
      if (!formData.title || !formData.category || !formData.duration) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.thumbnailFile && !formData.thumbnailUrl) {
        throw new Error('Please provide a thumbnail');
      }

      if (!formData.videoFile && !formData.videoUrl) {
        throw new Error('Please provide a video');
      }

      const updatedFormData = { ...formData };

      // Upload thumbnail if provided
      if (formData.thumbnailFile) {
        // Get fresh authentication for thumbnail
        const thumbnailAuthResponse = await fetch('/api/upload-auth');
        if (!thumbnailAuthResponse.ok) {
          throw new Error('Failed to get thumbnail upload authentication');
        }
        const thumbnailAuthData = await thumbnailAuthResponse.json();

        const fileExtension = formData.thumbnailFile.name.split('.').pop() || 'jpg';
        const fileName = `${formData.title.toLowerCase().replace(/\s+/g, '-')}-thumbnail-${Date.now()}.${fileExtension}`;
        
        const thumbnailResponse = await upload({
          file: formData.thumbnailFile,
          fileName,
          folder: '/thahfeez/thumbnails',
          ...thumbnailAuthData,
          urlEndpoint: thumbnailAuthData.urlEndpoint,
          onProgress: (event) => {
            setUploadProgress((event.loaded / event.total) * 50); // First 50% for thumbnail
          }
        });

        if (thumbnailResponse && thumbnailResponse.url) {
          updatedFormData.thumbnailUrl = thumbnailResponse.url;
        } else {
          throw new Error('Failed to upload thumbnail');
        }
      }

      // Upload video if provided
      if (formData.videoFile) {
        // Get fresh authentication for video
        const videoAuthResponse = await fetch('/api/upload-auth');
        if (!videoAuthResponse.ok) {
          throw new Error('Failed to get video upload authentication');
        }
        const videoAuthData = await videoAuthResponse.json();

        const fileExtension = formData.videoFile.name.split('.').pop() || 'mp4';
        const fileName = `${formData.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExtension}`;
        
        const videoResponse = await upload({
          file: formData.videoFile,
          fileName,
          folder: '/thahfeez/videos',
          ...videoAuthData,
          urlEndpoint: videoAuthData.urlEndpoint,
          onProgress: (event) => {
            setUploadProgress(50 + (event.loaded / event.total) * 50); // Last 50% for video
          }
        });

        if (videoResponse && videoResponse.url) {
          updatedFormData.videoUrl = videoResponse.url;
        } else {
          throw new Error('Failed to upload video');
        }
      }

      // Clear file references after successful upload
      updatedFormData.thumbnailFile = null;
      updatedFormData.videoFile = null;
    
      // Submit the form with updated data
      await onSubmit(updatedFormData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  // Show loading UI during upload
  if (isUploading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6 py-8">
        <h2 className="text-xl font-bold text-center text-white">Uploading Video</h2>
        
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Loader className="animate-spin h-12 w-12 text-purple-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{Math.round(uploadProgress)}%</span>
                </div>
              </div>
        </div>
        
        <div className="space-y-2 px-4">
              <Progress 
                value={uploadProgress} 
                className="h-2 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-purple-700"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading {formData.thumbnailFile ? 'thumbnail' : 'video'}...</span>
                <span>{Math.round(uploadProgress)}% complete</span>
              </div>
        </div>
        
        <p className="text-center text-sm text-gray-400 px-4">
              Please wait while we process your video. This may take a few minutes depending on the file size.
        </p>
          </div>
        </div>
      </div>
    );
  }

  // Show success UI after upload completes
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="space-y-6 py-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-green-900/20 p-3">
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-white">Upload Successful!</h2>
        
        <p className="text-gray-400 px-6">
          Your video "{formData.title}" has been uploaded successfully and will be available shortly.
        </p>

            <div className="pt-4">
              <Button 
                onClick={handleCancel}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default form UI
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Add New Video</h2>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Video Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter video title"
            required
                className="bg-[#221F26] border-gray-700 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange("category", value)}
          >
                <SelectTrigger className="bg-[#221F26] border-gray-700 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
                <SelectContent className="bg-[#221F26] text-white border-gray-700">
                  <SelectItem value="quran">Quran</SelectItem>
                  <SelectItem value="hadith">Hadith</SelectItem>
                  <SelectItem value="islamic-history">Islamic History</SelectItem>
                  <SelectItem value="fiqh">Fiqh</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-gray-300">Thumbnail</Label>
          <div className="flex flex-col space-y-2">
            <input 
              ref={thumbnailInputRef}
              type="file" 
              accept="image/*" 
              id="thumbnailFile" 
              className="hidden" 
              onChange={handleThumbnailChange}
            />
            <Input
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="Enter thumbnail URL or upload file"
                  className="bg-[#221F26] border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              onClick={() => thumbnailInputRef.current?.click()}
                  readOnly={!!formData.thumbnailFile}
            />
            <Button 
              type="button"
              variant="outline" 
                  className="flex items-center gap-2 border-gray-700 hover:bg-gray-800"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              <FileImage className="h-4 w-4" />
                  {formData.thumbnailFile ? "Change thumbnail" : "Upload thumbnail"}
            </Button>
            
            {thumbnailPreview && (
                  <div className="mt-2 rounded overflow-hidden bg-gray-800/50 p-2 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Preview:</p>
                <div className="h-32 w-full flex items-center justify-center overflow-hidden rounded">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="h-full w-auto object-contain" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
              <Label htmlFor="video" className="text-gray-300">Video</Label>
          <div className="flex flex-col space-y-2">
            <input 
              ref={videoInputRef}
              type="file" 
              accept="video/*" 
              id="videoFile" 
              className="hidden" 
              onChange={handleVideoChange}
            />
            <Input
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="Enter video URL or upload file"
                  className="bg-[#221F26] border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              onClick={() => videoInputRef.current?.click()}
                  readOnly={!!formData.videoFile}
            />
            <Button 
              type="button"
              variant="outline"
                  className="flex items-center gap-2 border-gray-700 hover:bg-gray-800"
              onClick={() => videoInputRef.current?.click()}
            >
              <VideoIcon className="h-4 w-4" />
                  {formData.videoFile ? "Change video" : "Upload video"}
            </Button>
            
            {videoFileName && (
                  <div className="mt-2 bg-gray-800/50 p-2 rounded border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Selected: {videoFileName}</p>
                
                {videoPreviewUrl && !videoPreviewUrl.includes('youtu') && (
                  <div className="rounded overflow-hidden mt-1 bg-black flex items-center justify-center">
                    <video 
                      src={videoPreviewUrl} 
                      controls 
                      className="max-h-32 w-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                {videoPreviewUrl && videoPreviewUrl.includes('youtu') && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <Play size={16} />
                    <span className="text-sm">YouTube video</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-300">Duration</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 42:30"
                className="bg-[#221F26] border-gray-700 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                className="data-[state=checked]:bg-purple-600"
          />
              <Label htmlFor="featured" className="text-gray-300">Featured Video</Label>
        </div>
      </div>

      <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter video description"
          rows={4}
              className="bg-[#221F26] border-gray-700 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-700 hover:bg-gray-800">
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Upload className="mr-2 h-4 w-4" /> {initialData ? "Update" : "Upload"} Video
        </Button>
      </div>
    </form>
      </div>
    </div>
  );
};

export default VideoUploadFormWithDuration;
