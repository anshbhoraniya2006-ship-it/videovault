import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const getLocalVideos = () => {
  try {
    return JSON.parse(localStorage.getItem('videovault_videos')) || [];
  } catch (e) {
    return [];
  }
};

const setLocalVideos = (videos) => {
  localStorage.setItem('videovault_videos', JSON.stringify(videos));
};

export const useVideoManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const addVideo = useCallback(async (videoData) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
      const videos = getLocalVideos();
      const newVideo = {
        id: Date.now().toString(),
        userId: currentUser?.id,
        youtube_url: videoData.youtube_url,
        title: videoData.title,
        description: videoData.description || '',
        tags: videoData.tags || '',
        thumbnail_url: videoData.thumbnail_url || '',
        view_count: 0,
        liked: false,
        notes: videoData.notes || '',
        created: new Date().toISOString()
      };
      
      setLocalVideos([...videos, newVideo]);
      setLoading(false);
      return newVideo;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [currentUser]);

  const updateVideo = useCallback(async (videoId, videoData) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      let videos = getLocalVideos();
      const index = videos.findIndex(v => v.id === videoId);
      if (index === -1) throw new Error("Video not found");
      
      videos[index] = { ...videos[index], ...videoData };
      setLocalVideos(videos);
      setLoading(false);
      return videos[index];
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const deleteVideo = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      let videos = getLocalVideos();
      videos = videos.filter(v => v.id !== videoId);
      setLocalVideos(videos);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getVideos = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      let videos = getLocalVideos();
      
      if (currentUser) {
        videos = videos.filter(v => v.userId === currentUser.id);
      }

      // Very basic simulation of sorts and filters
      if (options.sort === '-created') {
        videos.sort((a, b) => new Date(b.created) - new Date(a.created));
      }
      
      if (options.filter) {
        if (options.filter.includes('liked=true')) {
          videos = videos.filter(v => v.liked === true);
        }
      }

      setLoading(false);
      return videos;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [currentUser]);

  const getVideoById = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const videos = getLocalVideos();
      const video = videos.find(v => v.id === videoId);
      if (!video) throw new Error("Video not found");
      
      setLoading(false);
      return video;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const incrementViewCount = useCallback(async (videoId, currentCount) => {
    try {
      let videos = getLocalVideos();
      const index = videos.findIndex(v => v.id === videoId);
      if (index !== -1) {
        videos[index].view_count = (currentCount || 0) + 1;
        setLocalVideos(videos);
      }
    } catch (err) {
      console.error('Failed to increment view count:', err);
    }
  }, []);

  return {
    addVideo,
    updateVideo,
    deleteVideo,
    getVideos,
    getVideoById,
    incrementViewCount,
    loading,
    error
  };
};