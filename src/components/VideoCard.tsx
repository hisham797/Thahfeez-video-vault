import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video } from '@/contexts/VideoContext'; // Adjust the path based on where your VideoContext is
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Authentication Required",
        description: "Please log in to view this video.",
        variant: "destructive"
      });
      router.push('/login');
    }
  };

  return (
    <Link 
      href={`/videodetail/${video.id}`} 
      onClick={handleClick}
      className="video-card flex flex-col h-full transform hover:translate-y-[-5px] transition-all duration-300"
    >
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={video.thumbnail || '/placeholder.svg'}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow bg-card border-x border-b border-border rounded-b-lg">
        <h3 className="font-medium text-lg mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-muted-foreground text-sm mb-auto line-clamp-2">
          {video.description}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <span className="inline-block bg-secondary text-xs font-medium px-2 py-1 rounded">
            {video.category}
          </span>
          <span className="text-xs text-muted-foreground">
            Part {video.id}
          </span>
        </div>
      </div>
    </Link>
  );
}