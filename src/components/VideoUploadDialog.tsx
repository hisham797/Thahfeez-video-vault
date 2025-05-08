
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import EnhancedVideoUploadForm from "./EnhancedVideoUploadForm";

const VideoUploadDialog = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-primary hover:bg-primary/90">
          Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]" aria-describedby="video-upload-dialog-description">
        <div id="video-upload-dialog-description" className="sr-only">
          Video upload form with progress tracking
        </div>
        <EnhancedVideoUploadForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;
