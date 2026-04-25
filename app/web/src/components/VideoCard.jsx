import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, Heart, Link as LinkIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TagBadge from '@/components/TagBadge.jsx';
import AddToPlaylistMenu from '@/components/AddToPlaylistMenu.jsx';
import { useVideoManagement } from '@/hooks/useVideoManagement.js';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const VideoCard = ({ video, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(video.liked || false);
  const { updateVideo, deleteVideo } = useVideoManagement();
  const tags = video.tags ? video.tags.split(',').filter(t => t.trim()) : [];

  const handleCopyUrl = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(video.youtube_url);
    toast.success('URL copied to clipboard!');
  };

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    try {
      await updateVideo(video.id, { liked: newLikedState });
      if (newLikedState) toast.success('Added to favorites');
    } catch (err) {
      setIsLiked(!newLikedState);
      toast.error('Failed to update like status');
    }
  };

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(video.id);
        toast.success("Video deleted");
        if (onDelete) onDelete(video.id);
      } catch (err) {
        toast.error("Failed to delete video");
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-card/50 backdrop-blur-sm border-primary/10 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-muted">
        {!imageError && video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        <Link to={`/video/${video.id}`} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Button size="sm" variant="secondary">
            <Play className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2" style={{ textWrap: 'balance' }}>
          {video.title}
        </h3>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <TagBadge key={index} tag={tag.trim()} />
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{video.view_count || 0} views</span>
          </div>
          <div className="flex items-center gap-1 z-10">
            <AddToPlaylistMenu videoId={video.id} />
            <Button variant="ghost" size="icon" onClick={handleCopyUrl} className="h-8 w-8 hover:bg-muted" title="Copy URL">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleLike} 
              className={`h-8 w-8 hover:bg-muted ${isLiked ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : ''}`}
              title={isLiked ? "Unlike video" : "Like video"}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDeleteClick} className="h-8 w-8 hover:bg-muted text-red-500 hover:text-red-600" title="Delete Video">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default VideoCard;