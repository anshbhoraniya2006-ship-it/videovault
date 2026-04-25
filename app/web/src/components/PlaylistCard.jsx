import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Edit, Trash2, Download, Heart, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { usePlaylistManagement } from '@/hooks/usePlaylistManagement.js';
import { motion } from 'framer-motion';

const PlaylistCard = ({ playlist, onDelete }) => {
  const localVideoCount = playlist.videos ? playlist.videos.split(',').filter(v => v).length : 0;
  const videoCount = playlist.external_video_count ? playlist.external_video_count : localVideoCount;
  const [isLiked, setIsLiked] = useState(playlist.liked || false);
  const { updatePlaylist } = usePlaylistManagement();

  const handleCopyUrl = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = playlist.playlist_url ? playlist.playlist_url : `${window.location.origin}/playlists/${playlist.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Playlist link copied!');
  };

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    try {
      await updatePlaylist(playlist.id, { liked: newLikedState });
      if (newLikedState) toast.success('Added to favorites');
    } catch (err) {
      setIsLiked(!newLikedState);
      toast.error('Failed to update like status');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-card/50 backdrop-blur-sm border-primary/10 flex flex-col h-full">
        <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <List className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg line-clamp-1" title={playlist.playlist_name}>{playlist.playlist_name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {videoCount} {videoCount === 1 ? 'video' : 'videos'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={handleCopyUrl} className="h-8 w-8 hover:bg-muted" title="Copy Playlist Link">
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleLike} 
                className={`h-8 w-8 hover:bg-muted ${isLiked ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : ''}`}
                title={isLiked ? "Unlike playlist" : "Like playlist"}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow justify-end">
        {playlist.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 pb-2">
            {playlist.description}
          </p>
        )}
        
        <div className="flex gap-2">
          <Link to={`/playlists/${playlist.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={() => onDelete(playlist.id)} title="Delete Playlist">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default PlaylistCard;