import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useNoteManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNote = useCallback(async (noteData) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('notes').create({
        userId: pb.authStore.record.id,
        title: noteData.title,
        content: noteData.content || ''
      }, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (noteId, noteData) => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('notes').update(noteId, noteData, { $autoCancel: false });
      setLoading(false);
      return record;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (noteId) => {
    setLoading(true);
    setError(null);
    try {
      await pb.collection('notes').delete(noteId, { $autoCancel: false });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await pb.collection('notes').getFullList({
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

  return {
    createNote,
    updateNote,
    deleteNote,
    getNotes,
    loading,
    error
  };
};
