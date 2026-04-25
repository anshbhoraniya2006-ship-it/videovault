import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useVideoManagement } from '@/hooks/useVideoManagement.js';
import { ArrowLeft, Eye, Edit, Save, X } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import TagBadge from '@/components/TagBadge.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AddToPlaylistMenu from '@/components/AddToPlaylistMenu.jsx';
import { toast } from 'sonner';

const VideoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const { getVideoById, updateVideo, incrementViewCount, loading } = useVideoManagement();

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      const data = await getVideoById(id);
      setVideo(data);
      setEditedNotes(data.description || '');
      await incrementViewCount(id, data.view_count);
    } catch (err) {
      toast.error('Failed to load video');
      navigate('/dashboard');
    }
  };

  const getEmbedUrl = (url) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleSaveNotes = async () => {
    try {
      await updateVideo(video.id, { description: editedNotes });
      setVideo({ ...video, description: editedNotes });
      setIsEditingNotes(false);
      toast.success('Notes updated successfully');
    } catch (err) {
      toast.error('Failed to update notes');
    }
  };

  if (loading || !video) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Loading video..." />
        </div>
        <Footer />
      </>
    );
  }

  const tags = video.tags ? video.tags.split(',').filter(t => t.trim()) : [];
  const embedUrl = getEmbedUrl(video.youtube_url);

  return (
    <>
      <Helmet>
        <title>{`${video.title} - VideoVault`}</title>
        <meta name="description" content={video.description || `Watch ${video.title} on VideoVault`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden mb-6">
                  <div className="aspect-video bg-black">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Unable to load video player</p>
                      </div>
                    )}
                  </div>
                </Card>

                <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ textWrap: 'balance' }}>
                  {video.title}
                </h1>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold">Notes</h2>
                      {!isEditingNotes ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)} className="h-8">
                          <Edit className="h-4 w-4 mr-2" />
                          {video.description ? 'Edit Note' : 'Add Note'}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setIsEditingNotes(false); setEditedNotes(video.description || ''); }} className="h-8 hover:bg-red-50 hover:text-red-500">
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveNotes} className="h-8">
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {isEditingNotes ? (
                      <Textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Type your notes for this video here..."
                        className="min-h-[150px] resize-y bg-background/50"
                        autoFocus
                      />
                    ) : (
                      <div className="bg-muted/30 rounded-lg p-4 min-h-[100px]">
                        {video.description ? (
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {video.description}
                          </p>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-muted-foreground pt-4 pb-4">
                            <p className="text-sm">No notes have been added yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Eye className="h-4 w-4" />
                      <span>{video.view_count || 0} views</span>
                    </div>

                    {tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <TagBadge key={index} tag={tag.trim()} />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium mb-2">Original URL</h3>
                    <a
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {video.youtube_url}
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Add to Playlist</h3>
                      <p className="text-xs text-muted-foreground">Select a playlist to add this video to.</p>
                    </div>
                    <div>
                      <AddToPlaylistMenu videoId={video.id} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default VideoDetailsPage;