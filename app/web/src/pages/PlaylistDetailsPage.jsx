import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { usePlaylistManagement } from '@/hooks/usePlaylistManagement.js';
import { useVideoManagement } from '@/hooks/useVideoManagement.js';
import { ArrowLeft, List } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import VideoCard from '@/components/VideoCard.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  
  const { getPlaylistById } = usePlaylistManagement();
  const { getVideoById } = useVideoManagement();

  useEffect(() => {
    loadPlaylistData();
  }, [id]);

  const loadPlaylistData = async () => {
    setLoadingContent(true);
    try {
      const plData = await getPlaylistById(id);
      setPlaylist(plData);
      
      if (plData.videos) {
        const videoIds = plData.videos.split(',').filter(v => v.trim());
        const fetchedVideos = await Promise.all(
          videoIds.map(vId => getVideoById(vId).catch(() => null))
        );
        // Filter out any nulls incase a video was deleted
        setVideos(fetchedVideos.filter(v => v !== null));
      } else {
        setVideos([]);
      }
    } catch (err) {
      toast.error('Failed to load playlist details');
      navigate('/playlists');
    } finally {
      setLoadingContent(false);
    }
  };

  const getPlaylistEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? `https://www.youtube.com/embed/videoseries?list=${match[1]}` : null;
  };

  const embedUrl = playlist ? getPlaylistEmbedUrl(playlist.playlist_url) : null;

  if (loadingContent || !playlist) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Loading playlist..." />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${playlist.playlist_name} - VideoVault`}</title>
        <meta name="description" content={playlist.description || `Watch ${playlist.playlist_name} on VideoVault`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Link to="/playlists" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
              Back to Playlists
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{playlist.playlist_name}</h1>
              {playlist.description && (
                <p className="text-muted-foreground">{playlist.description}</p>
              )}
            </div>

            {/* Render YouTube Playlist Embed if a valid URL exists */}
            {embedUrl && (
              <div className="mb-12">
                <Card className="overflow-hidden bg-black border-none shadow-xl">
                  <div className="aspect-[21/9] sm:aspect-video w-full">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </Card>
              </div>
            )}

            {/* Render individual saved VideoCards */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Saved Videos in Playlist</h2>
                <span className="text-muted-foreground text-sm font-medium bg-muted px-3 py-1 rounded-full">
                  {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
                </span>
              </div>
              
              {videos.length === 0 ? (
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="py-12 flex flex-col items-center justify-center">
                    <List className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">No individual videos saved here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Go to the Dashboard or Save Video page to add some!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PlaylistDetailsPage;
