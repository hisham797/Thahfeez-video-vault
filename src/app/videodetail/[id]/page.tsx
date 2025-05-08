'use client'

import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { useVideos } from "@/contexts/VideoContext";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getVideoById, videos } = useVideos();
  const [progress, setProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  
  const video = id ? getVideoById(id) : undefined;
  
  // Get related videos (same category)
  const relatedVideos = video 
    ? videos.filter(v => v.category === video.category && v.id !== video.id)
    : [];

  // Find current video index
  const currentIndex = video ? videos.findIndex(v => v.id === video.id) : -1;
    
  useEffect(() => {
    // If video doesn't exist, redirect to videos page
    if (id && !video) {
      router.push("/videos");
    }
    
    // Load saved progress from localStorage if it exists
    if (id) {
      const savedProgress = localStorage.getItem(`video-progress-${id}`);
      if (savedProgress) {
        setProgress(parseInt(savedProgress));
        if (parseInt(savedProgress) >= 90) {
          setVideoCompleted(true);
        }
      }
    }
  }, [id, video, router]);
  
  if (!video) {
    return null;
  }

  const handleProgressUpdate = (currentProgress: number) => {
    setProgress(currentProgress);
    
    // Save progress to localStorage
    localStorage.setItem(`video-progress-${id}`, Math.round(currentProgress).toString());
    
    // Auto-mark as complete when 90% watched
    if (currentProgress >= 90 && !videoCompleted) {
      setVideoCompleted(true);
      toast({
        title: "Video almost complete",
        description: "Your progress has been saved",
      });
    }
  };

  const handleVideoComplete = () => {
    setProgress(100);
    setVideoCompleted(true);
    localStorage.setItem(`video-progress-${id}`, "100");
    toast({
      title: "Video completed",
      description: "Your progress has been saved",
    });
  };

  const handleMarkComplete = () => {
    setProgress(100);
    setVideoCompleted(true);
    localStorage.setItem(`video-progress-${id}`, "100");
    toast({
      title: "Video marked as complete",
      description: "Your progress has been saved",
    });
  };

  const handleNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      router.push(`/videodetail/${videos[currentIndex + 1].id}`);
    }
  };

  const handlePreviousVideo = () => {
    if (currentIndex > 0) {
      router.push(`/videodetail/${videos[currentIndex - 1].id}`);
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => router.push("/videos")}
            className="mb-6 flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Course</span>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Video and description */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="rounded-lg overflow-hidden border border-border bg-card">
                <VideoPlayer 
                  title={video.title} 
                  videoUrl={video.videoUrl} 
                  onNext={handleNextVideo}
                  onPrevious={handlePreviousVideo}
                  onProgress={handleProgressUpdate}
                  onComplete={handleVideoComplete}
                />
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{video.title}</h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{video.duration}</span>
                    <span className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      {video.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-[150px]">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <Button 
                    className="w-full sm:w-auto" 
                    disabled={videoCompleted}
                    onClick={handleMarkComplete}
                  >
                    {videoCompleted ? "Completed" : "Mark as complete"}
                  </Button>
                </div>
                
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{video.description}</p>
              </div>
            </div>
            
            {/* Right column - Course details */}
            <div className="col-span-1 space-y-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h2 className="text-xl font-semibold border-b border-border pb-3 mb-4">COURSE DETAILS</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <h3 className="font-medium">Duration</h3>
                      <p className="text-muted-foreground">10 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <h3 className="font-medium">Total Videos</h3>
                      <p className="text-muted-foreground">13</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <h3 className="font-medium">What You'll Learn</h3>
                      <ul className="text-muted-foreground space-y-2 mt-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Core programming concepts with C and Java</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Control structures, loops, and functions</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Object-oriented programming principles</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Real-world problem-solving by building a calculator project</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h2 className="text-xl font-semibold border-b border-border pb-3 mb-4">Next in this course</h2>
                  <div className="space-y-4">
                    
                      <div  className="flex gap-3 items-center">
                        <div className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center">
                          1
                        </div>
                        <div>
                          <h3 className="font-medium">Video Title</h3>
                          
                        </div>
                      </div>

                      <div  className="flex gap-3 items-center">
                        <div className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center">
                          2
                        </div>
                        <div>
                          <h3 className="font-medium">Video Title</h3>
                          
                        </div>
                      </div>

                      <div  className="flex gap-3 items-center">
                        <div className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center">
                          3
                        </div>
                        <div>
                          <h3 className="font-medium">Video Title</h3>
                          
                        </div>
                      </div>
                     
                    
                  </div>
                </div>
              
            </div>
          </div>
          
          {/* Course content sections - Video playlist */}
          {/* <div className="mt-8 p-6 rounded-lg border border-border bg-card">
            <h2 className="text-xl font-semibold border-b border-border pb-3 mb-4">COURSE CONTENT</h2>
            
            <div className="space-y-4">
              {videos
                .filter(v => v.category === video.category)
                .map((courseVideo, index) => (
                  <Link 
                    key={courseVideo.id}
                    href={`/videodetail/${courseVideo.id}`}
                    className={`flex items-center p-3 rounded-md hover:bg-accent transition-colors ${
                      courseVideo.id === video.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className="mr-4 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`font-medium ${courseVideo.id === video.id ? "text-primary" : ""}`}>
                          {courseVideo.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{courseVideo.duration}</p>
                      </div>
                    </div>
                    {courseVideo.id === video.id && (
                      <span className="text-xs font-medium text-primary">Currently viewing</span>
                    )}
                  </Link>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetail;
