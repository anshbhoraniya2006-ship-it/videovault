import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useVideoManagement } from '@/hooks/useVideoManagement.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import VideoForm from '@/components/VideoForm.jsx';
import VideoCard from '@/components/VideoCard.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { Button } from '@/components/ui/button';
import { Plus, Video as VideoIcon } from 'lucide-react';
import EmptyState from '@/components/EmptyState.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const SaveVideoPage = () => {
  const { addVideo, getVideos, loading } = useVideoManagement();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recentVideos, setRecentVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-created');

  React.useEffect(() => {
    loadRecentVideos();
  }, []);

  const loadRecentVideos = async () => {
    try {
      const data = await getVideos({ sort: '-created' });
      setRecentVideos(data.slice(0, 8)); // Show only recently added 8 videos
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = (deletedId) => {
    setRecentVideos(prev => prev.filter(v => v.id !== deletedId));
  };

  const handleSubmit = async (videoData) => {
    try {
      await addVideo(videoData);
      toast.success('Video saved to your library');
      setDialogOpen(false);
      loadRecentVideos(); // Reload recent videos without navigating away
    } catch (err) {
      toast.error('Failed to save video');
    }
  };

  return (
    <>
      <Helmet>
        <title>Save Video - VideoVault</title>
        <meta name="description" content="Save a new YouTube video to your VideoVault library." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Save a Video</h1>
                <p className="text-muted-foreground">
                  Add new content to your personal library
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Save YouTube Video</DialogTitle>
                    <DialogDescription>
                      Paste a YouTube URL and description to add it to your library
                    </DialogDescription>
                  </DialogHeader>
                  <VideoForm onSubmit={handleSubmit} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6 max-w-md">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                placeholder="Search recently saved videos..."
              />
            </div>

            {loading ? (
              <LoadingSpinner message="Loading recent videos..." />
            ) : recentVideos.length === 0 ? (
              <EmptyState
                icon={VideoIcon}
                title="Ready to save some videos?"
                description="Click the Add Video button above to open the form and save a new YouTube link along with its description!"
              />
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recently Saved</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentVideos
                    .filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase())))
                    .sort((a, b) => {
                      if (sortBy === 'title') return a.title.localeCompare(b.title);
                      if (sortBy === '-title') return b.title.localeCompare(a.title);
                      if (sortBy === '-view_count') return (b.view_count || 0) - (a.view_count || 0); // fallback if view_count missing
                      if (sortBy === 'created') return new Date(a.created) - new Date(b.created);
                      return new Date(b.created) - new Date(a.created); // Default to -created
                    })
                    .map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default SaveVideoPage;