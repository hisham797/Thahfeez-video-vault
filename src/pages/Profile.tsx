import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User, Palette } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import VideoUploadForm from "@/components/VideoUploadForm";

interface ProfileFormValues {
  name: string;
  email: string;
  bio: string;
  darkMode: boolean;
  accentColor: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: "",
      darkMode: true,
      accentColor: "blue",
    }
  });
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Apply theme changes (in a real app, this would be saved to user preferences)
    document.documentElement.classList.toggle("dark", data.darkMode);
    
    // Theme color would be applied through a context in a real application
    
    toast({ 
      title: "Profile updated",
      description: "Your profile has been successfully updated"
    });
    
    setSaving(false);
  };

  const handleVideoUpload = (videoData: {
    title: string;
    description: string;
    thumbnail: File | string;
    videoFile: File | string;
    category: string;
  }) => {
    // Simulate API call delay
    toast({ 
      title: "Video uploaded",
      description: `Your video "${videoData.title}" has been successfully uploaded`
    });
    
    // In a real app, you would send the video data to your backend
    console.log("Video data submitted:", videoData);
  };

  const nameInitials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {nameInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette size={16} />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form 
                      onSubmit={form.handleSubmit(onSubmit)} 
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="avatar" className="block text-sm font-medium mb-2">
                            Profile Picture
                          </label>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              {avatarPreview ? (
                                <AvatarImage src={avatarPreview} alt="Profile" />
                              ) : (
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {nameInitials}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <Input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="max-w-xs"
                            />
                          </div>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled 
                                  className="bg-muted cursor-not-allowed"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field}
                                  placeholder="Tell us about yourself"
                                  className="resize-none"
                                  rows={4}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the appearance of the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form 
                      onSubmit={form.handleSubmit(onSubmit)} 
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="darkMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Dark Mode</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Enable dark mode for a better viewing experience in low light
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accentColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accent Color</FormLabel>
                              <FormControl>
                                <ToggleGroup 
                                  type="single" 
                                  value={field.value}
                                  onValueChange={(value) => {
                                    if (value) field.onChange(value);
                                  }}
                                  className="justify-start"
                                >
                                  <ToggleGroupItem 
                                    value="blue" 
                                    aria-label="Blue"
                                    className="w-8 h-8 rounded-full bg-blue-500"
                                  />
                                  <ToggleGroupItem 
                                    value="purple" 
                                    aria-label="Purple"
                                    className="w-8 h-8 rounded-full bg-purple-500"
                                  />
                                  <ToggleGroupItem 
                                    value="green" 
                                    aria-label="Green"
                                    className="w-8 h-8 rounded-full bg-green-500"
                                  />
                                  <ToggleGroupItem 
                                    value="orange" 
                                    aria-label="Orange"
                                    className="w-8 h-8 rounded-full bg-orange-500"
                                  />
                                  <ToggleGroupItem 
                                    value="red" 
                                    aria-label="Red"
                                    className="w-8 h-8 rounded-full bg-red-500"
                                  />
                                </ToggleGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Preferences"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="uploads" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Video</CardTitle>
                  <CardDescription>
                    Share your educational content with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoUploadForm onSubmit={handleVideoUpload} />
                </CardContent>
              </Card>
              
              {/* My Uploaded Videos section would go here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
