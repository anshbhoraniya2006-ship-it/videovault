import React, { useState, useEffect } from 'react';
import { useFetchYouTubeInfo } from '@/hooks/useFetchYouTubeInfo.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Play } from 'lucide-react';

const VideoForm = ({ onSubmit, initialData = null, submitLabel = 'Save Video' }) => {
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtube_url || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '');
  const [previewLoading, setPreviewLoading] = useState(false);
  
  const { fetchVideoInfo } = useFetchYouTubeInfo();

  useEffect(() => {
    if (initialData) {
      setYoutubeUrl(initialData.youtube_url || '');
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setNotes(initialData.notes || '');
      setTags(initialData.tags || '');
      setThumbnailUrl(initialData.thumbnail_url || '');
    }
  }, [initialData]);

  const handleUrlChange = async (url) => {
    setYoutubeUrl(url);
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setPreviewLoading(true);
      try {
        const info = await fetchVideoInfo(url);
        setThumbnailUrl(info.thumbnail_url);
        if (!title) {
          setTitle(info.title);
        }
      } catch (err) {
        console.error('Failed to fetch video info:', err);
      } finally {
        setPreviewLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      youtube_url: youtubeUrl,
      title,
      description,
      notes,
      tags,
      thumbnail_url: thumbnailUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="youtube_url">YouTube URL</Label>
        <Input
          id="youtube_url"
          type="url"
          value={youtubeUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
          className="mt-1.5"
        />
      </div>

      {thumbnailUrl && (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
          {previewLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <img
              src={thumbnailUrl}
              alt="Video preview"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="h-16 w-16 text-white" />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          required
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Video description"
          rows={3}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="notes">Personal Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your personal notes about this video"
          rows={4}
          className="mt-1.5 bg-blue-50/10"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tutorial, react, javascript (comma-separated)"
          className="mt-1.5"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Separate tags with commas
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={previewLoading}>
        {submitLabel}
      </Button>
    </form>
  );
};

export default VideoForm;