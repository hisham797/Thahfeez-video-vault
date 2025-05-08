interface UploadOptions {
  file: File;
  fileName: string;
  type: 'thumbnail' | 'video';
}

export const uploadFile = async ({ file, fileName, type }: UploadOptions) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}; 