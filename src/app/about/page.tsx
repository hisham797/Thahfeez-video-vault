
import { Layout } from "@/components/Layout";
import { ArrowRight, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const About = () => {
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent hero-gradient">About Thahfeez Video Vault</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A premium educational video platform designed to help learners of all levels access high-quality instructional content.
          </p>
        </div>
        
        {/* Mission Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg">
              Our mission is to democratize education by providing accessible, engaging, and comprehensive 
              video lessons across a variety of subjects. We believe that quality education should be 
              available to everyone, regardless of their background or location.
            </p>
            <div className="pt-4">
              <Button asChild className="group">
                <Link href="/event-registration">
                  Join Our Platform
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-card border border-border shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="bg-primary/90 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                <Play className="h-8 w-8 text-white fill-white ml-1" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Our Story</h3>
              <p className="text-muted-foreground">
                Founded in 2023, Thahfeez Video Vault began with a simple vision: to create an immersive learning environment where users could access educational content on demand.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Approach */}
        <div className="bg-card border border-border rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Approach</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
                  <path d="M15 3v6h6" />
                  <path d="M10 16l4-4" />
                  <path d="M8 12h.01" />
                  <path d="M16 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Engaging</h3>
              <p className="text-sm text-muted-foreground">
                Our videos are designed to capture attention and maintain interest throughout the learning process.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h20" />
                  <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                  <path d="m7 21 5-5 5 5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Practical</h3>
              <p className="text-sm text-muted-foreground">
                We focus on real-world applications and skills that can be immediately applied.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessible</h3>
              <p className="text-sm text-muted-foreground">
                Content is structured to accommodate different learning styles and paces.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a7 7 0 0 0-7 7m7-7a7 7 0 0 1 7 7m-7-7v7h7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community-driven</h3>
              <p className="text-sm text-muted-foreground">
                We encourage collaboration and discussion among our users.
              </p>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <p className="text-lg text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Behind Thahfeez Video Vault is a team of passionate educators, developers, and content creators 
            dedicated to producing the highest quality educational materials.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Dr. Alex Johnson</h3>
              <p className="text-center text-muted-foreground mb-4">Founder & Lead Instructor</p>
              <p className="text-center text-sm">
                With over 15 years of experience in computer science education, Dr. Johnson leads our programming curriculum development.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Sarah Lee</h3>
              <p className="text-center text-muted-foreground mb-4">Content Director</p>
              <p className="text-center text-sm">
                Sarah oversees our content strategy, ensuring all videos maintain our high standards of quality and educational value.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Michael Torres</h3>
              <p className="text-center text-muted-foreground mb-4">Technical Lead</p>
              <p className="text-center text-sm">
                Michael ensures our platform delivers a seamless user experience with the latest technology innovations.
              </p>
            </div>
          </div>
        </div>
        
        {/* Join CTA */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a beginner looking to learn the basics or an experienced professional seeking to refine your skills, 
            Thahfeez Video Vault has something for you. Join our growing community of learners today.
          </p>
          <Button asChild size="lg" className="btn-primary px-8 py-6 text-lg">
            <Link href="/event-registration">Register Now</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default About;
