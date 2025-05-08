
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { FileVideo, FileImage, Upload } from 'lucide-react';

interface VideoUploadFormProps {
  onSubmit: (video: {
    title: string;
    description: string;
    thumbnail: File | string;
    videoFile: File | string;
    category: string;
  }) => void;
  existingVideo?: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    thumbnail?: string;
    videoUrl?: string;
  };
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onSubmit, existingVideo }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(existingVideo?.title || '');
  const [description, setDescription] = useState(existingVideo?.description || '');
  const [category, setCategory] = useState(existingVideo?.category || 'education');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(existingVideo?.thumbnail || '');
  const [videoFileName, setVideoFileName] = useState<string>('');
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // Create a preview URL for the thumbnail
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoFileName(file.name);
      toast({
        title: "Video Selected",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!thumbnailPreview && !thumbnailFile) {
      toast({
        title: "Error",
        description: "Thumbnail image is required",
        variant: "destructive",
      });
      return;
    }

    if (!existingVideo && !videoFile) {
      toast({
        title: "Error",
        description: "Video file is required",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      description,
      thumbnail: thumbnailFile || thumbnailPreview,
      videoFile: videoFile || (existingVideo?.videoUrl || ''),
      category,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('education');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setVideoFile(null);
    setVideoFileName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="news">News</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <div className="relative">
            <input 
              type="file" 
              ref={thumbnailInputRef}
              accept="image/*" 
              id="thumbnail" 
              className="hidden" 
              onChange={handleThumbnailChange}
            />
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              <FileImage className="h-4 w-4" />
              {thumbnailPreview ? "Change image" : "Select thumbnail"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {thumbnailPreview && (
            <div className="w-full h-32 rounded-md overflow-hidden">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <input 
            type="file" 
            ref={videoInputRef}
            accept="video/*" 
            id="video" 
            className="hidden" 
            onChange={handleVideoChange}
          />
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={() => videoInputRef.current?.click()}
          >
            <FileVideo className="h-4 w-4" />
            {videoFileName ? "Change video" : "Select video file"}
          </Button>
          
          {videoFileName && (
            <p className="text-xs text-gray-500 truncate">
              Selected: {videoFileName}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full flex items-center justify-center gap-2">
        <Upload className="h-4 w-4" />
        {existingVideo ? 'Update Video' : 'Upload Video'}
      </Button>
    </form>
  );
};

export default VideoUploadForm;
