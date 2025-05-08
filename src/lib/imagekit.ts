import ImageKit from 'imagekit';
import crypto from 'crypto';

const publicKey = 'public_x+pBR0uJajfmHuFedZdSke2Awro=';
const privateKey = 'public_x+pBR0uJajfmHuFedZdSke2Awro=';
const urlEndpoint = 'https://ik.imagekit.io/va7g9ab2n';

export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export const getImageKitAuth = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(timestamp.toString())
    .digest('hex');

  return {
    signature,
    expire: timestamp + 3600, // 1 hour expiry
    token: signature,
  };
};

interface UploadOptions {
  file: File;
  fileName: string;
  type: 'thumbnail' | 'video';
}

export const uploadToImageKit = async ({ file, fileName, type }: UploadOptions) => {
  try {
    // Get authentication parameters
    const auth = getImageKitAuth();

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('folder', `/thahfeez/${type === 'thumbnail' ? 'thumbnails' : 'videos'}`);
    formData.append('signature', auth.signature);
    formData.append('expire', auth.expire.toString());
    formData.append('token', auth.token);
    formData.append('publicKey', publicKey);

    // Upload to ImageKit
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload file');
    }

    const data = await response.json();
    return {
      url: data.url,
      fileId: data.fileId,
      name: data.name,
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw error;
  }
}; 