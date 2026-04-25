import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const getLocalNotes = () => {
  try {
    return JSON.parse(localStorage.getItem('videovault_notes')) || [];
  } catch (e) {
    return [];
  }
};

const setLocalNotes = (notes) => {
  localStorage.setItem('videovault_notes', JSON.stringify(notes));
};

export const useNoteManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const createNote = useCallback(async (noteData) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const notes = getLocalNotes();
      const newNote = {
        id: Date.now().toString(),
        userId: currentUser?.id,
        title: noteData.title,
        content: noteData.content || '',
        created: new Date().toISOString()
      };
      
      setLocalNotes([...notes, newNote]);
      setLoading(false);
      return newNote;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [currentUser]);

  const updateNote = useCallback(async (noteId, noteData) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      let notes = getLocalNotes();
      const index = notes.findIndex(n => n.id === noteId);
      if (index === -1) throw new Error("Note not found");
      
      notes[index] = { ...notes[index], ...noteData };
      setLocalNotes(notes);
      setLoading(false);
      return notes[index];
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
      await new Promise(resolve => setTimeout(resolve, 300));
      let notes = getLocalNotes();
      notes = notes.filter(n => n.id !== noteId);
      setLocalNotes(notes);
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
      await new Promise(resolve => setTimeout(resolve, 300));
      let notes = getLocalNotes();
      if (currentUser) {
        notes = notes.filter(n => n.userId === currentUser.id);
      }
      notes.sort((a, b) => new Date(b.created) - new Date(a.created));
      setLoading(false);
      return notes;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [currentUser]);

  return {
    createNote,
    updateNote,
    deleteNote,
    getNotes,
    loading,
    error
  };
};
