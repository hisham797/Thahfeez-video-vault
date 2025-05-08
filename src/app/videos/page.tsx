'use client'
import { Layout } from "@/components/Layout";
import { VideoCard } from "@/components/VideoCard";
import { useVideos, Video } from "@/contexts/VideoContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Videos = () => {
  const { videos } = useVideos();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  
  // Get unique categories
  const categories = Array.from(new Set(videos.map(video => video.category)));
  
  // Filter videos based on search and category
  const filteredVideos = videos.filter(video => {
    const matchesQuery = video.title.toLowerCase().includes(query.toLowerCase()) || 
                        video.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category ? video.category === category : true;
    
    return matchesQuery && matchesCategory;
  });

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Video Library</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search videos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === null ? "secondary" : "outline"}
                onClick={() => setCategory(null)}
                className="whitespace-nowrap"
              >
                All Categories
              </Button>
              
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "secondary" : "outline"}
                  onClick={() => setCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Video Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video: Video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button variant="outline" onClick={() => {setQuery(""); setCategory(null);}}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Videos;
