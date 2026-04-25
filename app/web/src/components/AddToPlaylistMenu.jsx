import React, { useState, useEffect } from 'react';
import { usePlaylistManagement } from '@/hooks/usePlaylistManagement.js';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const AddToPlaylistMenu = ({ videoId }) => {
  const [playlists, setPlaylists] = useState([]);
  const { getPlaylists, addVideoToPlaylist } = usePlaylistManagement();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error('Failed to load playlists', err);
    }
  };

  const handleAddToPlaylist = async (playlistId, playlistName, e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await addVideoToPlaylist(playlistId, videoId);
      toast.success(`Added to ${playlistName}`);
    } catch (err) {
      toast.error('Failed to add to playlist');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Add to Playlist" onClick={(e) => { e.stopPropagation(); }}>
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Add to Playlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {playlists.length === 0 ? (
          <DropdownMenuItem disabled>No playlists available</DropdownMenuItem>
        ) : (
          playlists.map((playlist) => {
            const hasVideo = playlist.videos && playlist.videos.includes(videoId);
            return (
              <DropdownMenuItem 
                key={playlist.id} 
                onClick={(e) => handleAddToPlaylist(playlist.id, playlist.playlist_name, e)}
                disabled={hasVideo}
                className="cursor-pointer"
              >
                {playlist.playlist_name} {hasVideo ? '(Added)' : ''}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToPlaylistMenu;
