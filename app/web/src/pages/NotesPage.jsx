import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNoteManagement } from '@/hooks/useNoteManagement.js';
import { FileText, Plus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import NoteCard from '@/components/NoteCard.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const { getNotes, createNote, deleteNote, loading } = useNoteManagement();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-created');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      toast.error('Failed to load notes');
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    
    setSubmitting(true);
    try {
      await createNote({ title: noteTitle, content: noteContent });
      toast.success('Note saved successfully');
      setDialogOpen(false);
      setNoteTitle('');
      setNoteContent('');
      loadNotes(); // Refresh notes list
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success("Note deleted");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <>
      <Helmet>
        <title>My Notebook - VideoVault</title>
        <meta name="description" content="A general notebook built into VideoVault." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Notebook</h1>
                <p className="text-muted-foreground">
                  Your dedicated space to jot down free-form thoughts
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>New Note</DialogTitle>
                    <DialogDescription>
                      Create a standalone note independent of any video.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateNote} className="space-y-4">
                    <div>
                      <Input 
                        placeholder="Note Title" 
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Textarea 
                        placeholder="Type your notes here..." 
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        required
                        rows={10}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Note
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6 max-w-md">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                placeholder="Search notes..."
              />
            </div>

            {loading ? (
              <LoadingSpinner message="Loading your notebook..." />
            ) : notes.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Notebook is empty"
                description="Click the Add Note button above to start writing!"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notes
                  .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => {
                    if (sortBy === 'title') return a.title.localeCompare(b.title);
                    if (sortBy === '-title') return b.title.localeCompare(a.title);
                    if (sortBy === 'created') return new Date(a.created) - new Date(b.created);
                    return new Date(b.created) - new Date(a.created);
                  })
                  .map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
                ))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default NotesPage;
