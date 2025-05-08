
import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Check, Loader } from "lucide-react";
import { toast } from "sonner";

const EnhancedVideoUploadForm = ({ onClose }: { onClose?: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate uploading with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
        // Show success after upload completes
        setTimeout(() => {
          setIsUploading(false);
          setIsSuccess(true);
          toast.success("Video uploaded successfully!");
          
          // Reset form after 2 seconds or allow user to close
          setTimeout(() => {
            if (onClose) {
              onClose();
            }
          }, 3000);
        }, 500);
      }
      setUploadProgress(progress);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a video file");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    simulateUpload();
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {!isUploading && !isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="video">Video File</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="cursor-pointer"
              required
            />
            {file && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {file.name}
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full">
            Upload Video
          </Button>
        </form>
      ) : isUploading ? (
        <div className="space-y-6 py-8">
          <h2 className="text-2xl font-bold text-center">Uploading Video</h2>
          
          <div className="flex items-center justify-center mb-4">
            <Loader className="animate-spin h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-center text-sm text-gray-500">
              {Math.round(uploadProgress)}% complete
            </p>
          </div>
          
          <p className="text-center text-sm text-gray-500">
            Please don't close this window while uploading...
          </p>
        </div>
      ) : (
        <div className="space-y-6 py-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold">Upload Successful!</h2>
          
          <p className="text-gray-600">
            Your video "{title}" has been uploaded successfully and is being processed.
          </p>
          
          <Button onClick={onClose} className="mt-4">
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoUploadForm;
