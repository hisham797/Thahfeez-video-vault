
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useVideos, Video } from "@/contexts/VideoContext";
import { VideoCard } from "@/components/VideoCard";
import { AlertCircle, ArrowRight, Award, CheckCircle, Users } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

const Index = () => {
  const { featuredVideos } = useVideos();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-brandDarker">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover and <span className="bg-clip-text text-transparent hero-gradient">Learn</span> with 
                <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent hero-gradient"> Vista Video Vault</span>
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl max-w-lg">
                Unlock a world of educational content with our comprehensive video library.
              </p>
              
              {/* Seats Available Notice */}
              <div className="flex items-center bg-accent/20 border border-accent/40 text-accent-foreground rounded-lg p-3 max-w-sm">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium">Only 6 seats remaining for this month's enrollment!</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-primary text-lg px-8 py-6">
                  <Link to="/event-registration">Join Now</Link>
                </Button>
                <Button asChild variant="outline" className="text-lg px-8 py-6">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="bg-card rounded-lg overflow-hidden shadow-2xl border border-border animate-scale-in">
                <img 
                  src="/lovable-uploads/368b5a35-0a2d-486c-924e-19b4b78d59bc.png" 
                  alt="Education video platform"
                  className="w-full rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Introduction to Programming</h3>
                  <p className="text-muted-foreground">Learn the fundamental concepts that every beginner needs to know</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">42:30 minutes</span>
                    <Button variant="ghost" size="sm">Watch Now</Button>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 -right-8 -rotate-12 z-[-1] bg-primary/20 blur-3xl w-56 h-56 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">About Vista Video Vault</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Founded in 2023, we're on a mission to make quality education accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
              <p className="text-sm text-muted-foreground">
                Access high-quality video lessons created by industry experts across various subjects.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn Anywhere</h3>
              <p className="text-sm text-muted-foreground">
                Study at your own pace, on any device, with our user-friendly platform.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Join our growing community of learners and connect with like-minded individuals.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" className="group">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Videos</h2>
              <p className="text-muted-foreground">Hand-picked content to start your learning journey</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/register">See All Videos</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video: Video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-brandDark">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our platform today and get access to our full library of educational videos.
          </p>
          <Button asChild className="btn-primary text-lg px-8 py-6">
            <Link to="/event-registration">Register Now</Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background" id="contact">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
            <p className="text-muted-foreground">Have questions? We're here to help!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
              <p className="text-muted-foreground mb-6">
                We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span>+1 234 567 890</span>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span>info@vistavideovault.com</span>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span>123 Learning Street, Education City</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border shadow-lg">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your email"
                    className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your message"
                    className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button className="w-full btn-primary">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
