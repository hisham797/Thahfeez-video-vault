'use client';

import { useRef, useState } from 'react';
import { upload } from '@imagekit/next';

interface ImageKitUploadProps {
  onUploadComplete: (response: any) => void;
  onError: (error: Error) => void;
  type: 'thumbnail' | 'video';
  className?: string;
}

export default function ImageKitUpload({ onUploadComplete, onError, type, className }: ImageKitUploadProps) {
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef<AbortController | null>(null);

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) {
      onError(new Error('Please select a file to upload'));
      return;
    }

    const file = fileInput.files[0];
    abortController.current = new AbortController();

    try {
      // Get authentication parameters
      const authResponse = await fetch('/api/upload-auth');
      if (!authResponse.ok) {
        throw new Error('Failed to get upload credentials');
      }
      const auth = await authResponse.json();

      // Upload file
      const uploadResponse = await upload({
        file,
        fileName: file.name,
        folder: `/thahfeez/${type === 'thumbnail' ? 'thumbnails' : 'videos'}`,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.current.signal,
        ...auth,
      });

      onUploadComplete(uploadResponse);
      setProgress(0);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Upload failed'));
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        accept={type === 'thumbnail' ? 'image/*' : 'video/*'}
        className="hidden"
        onChange={handleUpload}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Upload {type === 'thumbnail' ? 'Thumbnail' : 'Video'}
      </button>
      {progress > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
} 