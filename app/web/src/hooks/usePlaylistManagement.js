import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const usePlaylistManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPlaylist = useCallback(async (playlistData) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('playlists').create({
        userId: pb.authStore.record.id,
        playlist_name: playlistData.playlist_name,
        playlist_url: playlistData.playlist_url || '',
        description: playlistData.description || '',
        videos: playlistData.videos || '',
        liked: playlistData.liked || false,
        external_video_count: playlistData.external_video_count || 0
      }, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const updatePlaylist = useCallback(async (playlistId, playlistData) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('playlists').update(playlistId, playlistData, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const deletePlaylist = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      await pb.collection('playlists').delete(playlistId, { $autoCancel: false });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await pb.collection('playlists').getFullList({
        sort: '-created',
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

  const getPlaylistById = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('playlists').getOne(playlistId, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const addVideoToPlaylist = useCallback(async (playlistId, videoId) => {
    setLoading(true);
    setError(null);
    try {
      const playlist = await pb.collection('playlists').getOne(playlistId, { $autoCancel: false });
      const currentVideos = playlist.videos ? playlist.videos.split(',').filter(v => v) : [];
      
      if (!currentVideos.includes(videoId)) {
        currentVideos.push(videoId);
        const record = await pb.collection('playlists').update(playlistId, {
          videos: currentVideos.join(',')
        }, { $autoCancel: false });
        setLoading(false);
        return record;
      }
      setLoading(false);
      return playlist;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const removeVideoFromPlaylist = useCallback(async (playlistId, videoId) => {
    setLoading(true);
    setError(null);
    try {
      const playlist = await pb.collection('playlists').getOne(playlistId, { $autoCancel: false });
      const currentVideos = playlist.videos ? playlist.videos.split(',').filter(v => v) : [];
      const updatedVideos = currentVideos.filter(v => v !== videoId);
      
      const record = await pb.collection('playlists').update(playlistId, {
        videos: updatedVideos.join(',')
      }, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    loading,
    error
  };
};