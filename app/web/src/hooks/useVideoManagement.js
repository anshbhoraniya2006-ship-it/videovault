import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useVideoManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addVideo = useCallback(async (videoData) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('videos').create({
        userId: pb.authStore.record.id,
        youtube_url: videoData.youtube_url,
        title: videoData.title,
        description: videoData.description || '',
        tags: videoData.tags || '',
        thumbnail_url: videoData.thumbnail_url || '',
        view_count: 0,
        liked: false,
        notes: videoData.notes || ''
      }, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateVideo = useCallback(async (videoId, videoData) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('videos').update(videoId, videoData, { $autoCancel: false });
      setLoading(false);
      return record;
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
      await pb.collection('videos').delete(videoId, { $autoCancel: false });
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
      const records = await pb.collection('videos').getFullList({
        sort: options.sort || '-created',
        filter: options.filter || '',
        $autoCancel: false
      });
      setLoading(false);
      return records;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getVideoById = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('videos').getOne(videoId, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const incrementViewCount = useCallback(async (videoId, currentCount) => {
    try {
      await pb.collection('videos').update(videoId, {
        view_count: (currentCount || 0) + 1
      }, { $autoCancel: false });
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