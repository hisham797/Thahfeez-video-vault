export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowUploads: boolean;
  allowedFileTypes: string;
  maxFileSize: number;
  allowRegistrations: boolean;
  enableComments: boolean;
  enableRatings: boolean;
  featuredVideosLimit: number;
  updatedAt?: Date;
} 