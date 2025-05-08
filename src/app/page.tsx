// pages/index.tsx
"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // ✅ Use Next.js Link
import { useVideos, Video } from "@/contexts/VideoContext";
import { VideoCard } from "@/components/VideoCard";
import { AlertCircle, ArrowRight, Award, CheckCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";

const IndexPage = () => {
  const { featuredVideos } = useVideos();
  const [remainingSeats, setRemainingSeats] = useState<number | null>(null);
  const { settings, loading: settingsLoading } = useSettings();

  useEffect(() => {
    const fetchRemainingSeats = async () => {
      try {
        const response = await fetch('/api/registrations/count');
        const data = await response.json();
        if (response.ok) {
          setRemainingSeats(data.remaining);
        }
      } catch (error) {
        console.error('Error fetching remaining seats:', error);
      }
    };

    fetchRemainingSeats();
  }, []);

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
                <span className="bg-clip-text text-transparent hero-gradient">
                  {settingsLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>
                      {settings?.siteName || 'Vista'} <span className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">Video Vault</span>
                    </>
                  )}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl max-w-lg">
                {settingsLoading ? (
                  <span className="animate-pulse">Loading description...</span>
                ) : (
                  settings?.siteDescription || 'Unlock a world of educational content with our comprehensive video library.'
                )}
              </p>
              
              {/* Seats Available Notice */}
              {remainingSeats !== null && remainingSeats > 0 && (
                <div className="flex items-center bg-accent/20 border border-accent/40 text-accent-foreground rounded-lg p-3 max-w-[24.5rem] ">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Only {remainingSeats} {remainingSeats === 1 ? 'seat' : 'seats'} remaining for this month's enrollment!
                  </span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-primary text-lg px-8 py-6">
                  <Link href="/event-registration">Join Now</Link>
                </Button>
                <Button asChild variant="outline" className="text-lg px-8 py-6">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="bg-card rounded-lg overflow-hidden shadow-2xl border border-border animate-scale-in">
                <img 
                  src="https://i.pinimg.com/736x/ff/db/c4/ffdbc4aa391e85faaf53e9212b6b104e.jpg" 
                  alt="Education video platform"
                  className="w-full h-[20.4rem] rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Introduction to Hifzul Quran</h3>
                  <p className="text-muted-foreground">Learn the fundamental concepts that every beginner needs to know</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">42:30 minutes</span>
                    <Link href="/videos">
                    <Button variant="ghost" size="sm">Watch Now</Button>
                    </Link>
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
            <Stat icon={<Award className="h-6 w-6 text-primary" />} title="Premium Content" text="Access high-quality video lessons created by industry experts across various subjects." />
            <Stat icon={<CheckCircle className="h-6 w-6 text-accent" />} title="Learn Anywhere" text="Study at your own pace, on any device, with our user-friendly platform." />
            <Stat icon={<Users className="h-6 w-6 text-primary" />} title="Community Support" text="Join our growing community of learners and connect with like-minded individuals." />
          </div>

          <div className="text-center">
            <Button asChild variant="outline" className="group">
              <Link href="/about">
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
              <Link href="/register">See All Videos</Link>
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
            <Link href="/event-registration">Register Now</Link>
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
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;

// Optional helper components
const Stat = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

const ContactInfo = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
    <p className="text-muted-foreground mb-6">
      We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
    </p>
    <div className="space-y-4">
      <ContactItem icon="phone" text="+1 234 567 890" />
      <ContactItem icon="email" text="info@vistavideovault.com" />
      <ContactItem icon="location" text="123 Learning Street, Education City" />
    </div>
  </div>
);

const ContactItem = ({ icon, text }: { icon: "phone" | "email" | "location", text: string }) => {
  const icons = {
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28..."/>
      </svg>
    ),
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26..."/>
      </svg>
    ),
    location: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414..."/>
      </svg>
    ),
  };
  return (
    <div className="flex items-center">
      <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
        {icons[icon]}
      </span>
      <span>{text}</span>
    </div>
  );
};

const ContactForm = () => (
  <div className="bg-card p-6 rounded-lg border border-border shadow-lg">
    <form className="space-y-4">
      <InputField id="name" label="Name" type="text" placeholder="Your name" />
      <InputField id="email" label="Email" type="email" placeholder="Your email" />
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
);

const InputField = ({ id, label, type, placeholder }: { id: string; label: string; type: string; placeholder: string }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);
