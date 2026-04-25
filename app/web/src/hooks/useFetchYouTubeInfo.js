import { useState, useCallback } from 'react';

export const useFetchYouTubeInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const fetchVideoInfo = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    
    try {
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      const videoInfo = {
        videoId,
        thumbnail_url: thumbnail,
        title: `YouTube Video ${videoId}`,
        youtube_url: url
      };
      
      setLoading(false);
      return videoInfo;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    fetchVideoInfo,
    extractVideoId,
    loading,
    error
  };
};