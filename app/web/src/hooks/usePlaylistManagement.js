import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const getLocalPlaylists = () => {
  try {
    return JSON.parse(localStorage.getItem('videovault_playlists')) || [];
  } catch (e) {
    return [];
  }
};

const setLocalPlaylists = (playlists) => {
  localStorage.setItem('videovault_playlists', JSON.stringify(playlists));
};

export const usePlaylistManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createPlaylist = useCallback(async (playlistData) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const playlists = getLocalPlaylists();
      const newPlaylist = {
        id: Date.now().toString(),
        userId: currentUser?.id,
        playlist_name: playlistData.playlist_name,
        playlist_url: playlistData.playlist_url || '',
        description: playlistData.description || '',
        videos: playlistData.videos || '',
        liked: playlistData.liked || false,
        external_video_count: playlistData.external_video_count || 0,
        created: new Date().toISOString()
      };
      
      setLocalPlaylists([...playlists, newPlaylist]);
      setLoading(false);
      return newPlaylist;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [currentUser]);

  const updatePlaylist = useCallback(async (playlistId, playlistData) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      let playlists = getLocalPlaylists();
      const index = playlists.findIndex(p => p.id === playlistId);
      if (index === -1) throw new Error("Playlist not found");
      
      playlists[index] = { ...playlists[index], ...playlistData };
      setLocalPlaylists(playlists);
      setLoading(false);
      return playlists[index];
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
      await new Promise(resolve => setTimeout(resolve, 300));
      let playlists = getLocalPlaylists();
      playlists = playlists.filter(p => p.id !== playlistId);
      setLocalPlaylists(playlists);
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
      await new Promise(resolve => setTimeout(resolve, 300));
      let playlists = getLocalPlaylists();
      if (currentUser) {
        playlists = playlists.filter(p => p.userId === currentUser.id);
      }
      playlists.sort((a, b) => new Date(b.created) - new Date(a.created));
      setLoading(false);
      return playlists;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [currentUser]);

  const getPlaylistById = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const playlists = getLocalPlaylists();
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) throw new Error("Playlist not found");
      setLoading(false);
      return playlist;
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
      await new Promise(resolve => setTimeout(resolve, 300));
      let playlists = getLocalPlaylists();
      const index = playlists.findIndex(p => p.id === playlistId);
      if (index === -1) throw new Error("Playlist not found");
      
      const playlist = playlists[index];
      const currentVideos = playlist.videos ? playlist.videos.split(',').filter(v => v) : [];
      
      if (!currentVideos.includes(videoId)) {
        currentVideos.push(videoId);
        playlists[index].videos = currentVideos.join(',');
        setLocalPlaylists(playlists);
        setLoading(false);
        return playlists[index];
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
      await new Promise(resolve => setTimeout(resolve, 300));
      let playlists = getLocalPlaylists();
      const index = playlists.findIndex(p => p.id === playlistId);
      if (index === -1) throw new Error("Playlist not found");
      
      const playlist = playlists[index];
      const currentVideos = playlist.videos ? playlist.videos.split(',').filter(v => v) : [];
      const updatedVideos = currentVideos.filter(v => v !== videoId);
      
      playlists[index].videos = updatedVideos.join(',');
      setLocalPlaylists(playlists);
      setLoading(false);
      return playlists[index];
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