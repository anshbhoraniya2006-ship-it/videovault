import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { usePlaylistManagement } from '@/hooks/usePlaylistManagement.js';
import { List, Plus } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PlaylistCard from '@/components/PlaylistCard.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [description, setDescription] = useState('');
  const [videoCount, setVideoCount] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-created');
  const { getPlaylists, createPlaylist, deletePlaylist, loading } = usePlaylistManagement();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (err) {
      toast.error('Failed to load playlists');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      await createPlaylist({ 
        playlist_name: playlistName, 
        playlist_url: playlistUrl, 
        description,
        external_video_count: parseInt(videoCount) || 0,
        liked: isLiked
      });
      toast.success('Playlist created');
      setDialogOpen(false);
      setPlaylistName('');
      setPlaylistUrl('');
      setDescription('');
      setVideoCount('');
      setIsLiked(false);
      loadPlaylists();
    } catch (err) {
      toast.error('Failed to create playlist');
    }
  };

  const handleDelete = async (playlistId) => {
    if (!window.confirm('Delete this playlist?')) {
      return;
    }

    try {
      await deletePlaylist(playlistId);
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      toast.success('Playlist deleted successfully');
    } catch (error) {
      toast.error('Failed to delete playlist');
    }
  };

  return (
    <>
      <Helmet>
        <title>Playlists - VideoVault</title>
        <meta name="description" content="Manage your video playlists in VideoVault." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Playlists</h1>
                <p className="text-muted-foreground">
                  {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Playlist
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
                    <DialogDescription>
                      Create a new playlist to organize your videos
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <Label htmlFor="playlist_name">Playlist Name</Label>
                      <Input
                        id="playlist_name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder="My Awesome Playlist"
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="playlist_url">Playlist URL (Optional)</Label>
                      <Input
                        id="playlist_url"
                        value={playlistUrl}
                        onChange={(e) => setPlaylistUrl(e.target.value)}
                        placeholder="https://youtube.com/playlist?list=..."
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this playlist about?"
                        rows={2}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="video_count">Number of Videos</Label>
                        <Input
                          id="video_count"
                          type="number"
                          min="0"
                          value={videoCount}
                          onChange={(e) => setVideoCount(e.target.value)}
                          placeholder="e.g. 10"
                          className="mt-1.5"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-7">
                        <input 
                          type="checkbox" 
                          id="like_playlist" 
                          checked={isLiked} 
                          onChange={(e) => setIsLiked(e.target.checked)} 
                          className="w-4 h-4 cursor-pointer"
                        />
                        <Label htmlFor="like_playlist" className="cursor-pointer">Like Playlist</Label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Create Playlist
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6 max-w-md">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                placeholder="Search playlists..."
              />
            </div>

            {loading ? (
              <LoadingSpinner message="Loading playlists..." />
            ) : playlists.length === 0 ? (
              <EmptyState
                icon={List}
                title="No playlists yet"
                description="Create your first playlist to organize your videos"
                actionLabel="Create Playlist"
                actionPath="#"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists
                  .filter(p => p.playlist_name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => {
                    if (sortBy === 'title') return a.playlist_name.localeCompare(b.playlist_name);
                    if (sortBy === '-title') return b.playlist_name.localeCompare(a.playlist_name);
                    if (sortBy === 'created') return new Date(a.created) - new Date(b.created);
                    return new Date(b.created) - new Date(a.created); // Default to -created
                  })
                  .map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PlaylistsPage;