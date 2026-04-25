import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useVideoManagement } from '@/hooks/useVideoManagement.js';
import { usePlaylistManagement } from '@/hooks/usePlaylistManagement.js';
import { useNoteManagement } from '@/hooks/useNoteManagement.js';
import { Video, PlusCircle, ListPlus, FileText, Library } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import VideoCard from '@/components/VideoCard.jsx';
import PlaylistCard from '@/components/PlaylistCard.jsx';
import NoteCard from '@/components/NoteCard.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import { toast } from 'sonner';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // Data States
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [notes, setNotes] = useState([]);
  
  // Filtered States
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-created');
  
  const { getVideos, loading: loadingVideos } = useVideoManagement();
  const { getPlaylists, deletePlaylist } = usePlaylistManagement();
  const { getNotes, deleteNote } = useNoteManagement();

  useEffect(() => {
    loadAllData();
  }, [sortBy]);

  useEffect(() => {
    filterAllData();
  }, [searchQuery, videos, playlists, notes]);

  const loadAllData = async () => {
    try {
      const [vData, pData, nData] = await Promise.all([
        getVideos({ sort: sortBy }).catch(() => []),
        getPlaylists().catch(() => []),
        getNotes().catch(() => [])
      ]);
      setVideos(vData);
      setPlaylists(pData);
      setNotes(nData);
    } catch (err) {
      toast.error('Failed to load some dashboard data');
    }
  };

  const filterAllData = () => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos);
      setFilteredPlaylists(playlists);
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    setFilteredVideos(videos.filter(video => 
      video.title.toLowerCase().includes(query) ||
      video.description?.toLowerCase().includes(query) ||
      video.tags?.toLowerCase().includes(query)
    ));
    
    setFilteredPlaylists(playlists.filter(playlist => 
      playlist.playlist_name.toLowerCase().includes(query) ||
      playlist.description?.toLowerCase().includes(query)
    ));
    
    setFilteredNotes(notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    ));
  };

  // Handlers for deleting items directly from dashboard
  const handleDeleteVideo = (deletedId) => {
    setVideos(prev => prev.filter(v => v.id !== deletedId));
  };
  
  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await deletePlaylist(playlistId);
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      toast.success('Playlist deleted');
    } catch (err) {
      toast.error('Failed to delete playlist');
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
        <title>Dashboard - VideoVault</title>
        <meta name="description" content="View your saved YouTube videos, playlists, and notes." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Library Hub</h1>
                <p className="text-muted-foreground">
                  A snapshot of all your saved content.
                </p>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link to="/save-video">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors h-full">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <PlusCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Save Video</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{videos.length} Saved Videos</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/playlists">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors h-full">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <ListPlus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Playlists</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{playlists.length} Collections</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/notes">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors h-full">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Notes</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{notes.length} Written Notes</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Search Bar - Global across all data */}
            <div className="mb-10">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {loadingVideos ? (
              <LoadingSpinner message="Loading your library..." />
            ) : filteredVideos.length === 0 && filteredPlaylists.length === 0 && filteredNotes.length === 0 ? (
              <EmptyState
                icon={Library}
                title="Your library is empty"
                description={searchQuery ? `No results match "${searchQuery}".` : "You haven't saved any videos, playlists, or notes yet."}
              />
            ) : (
              <div className="space-y-12">
                
                {/* Playlists Section */}
                {filteredPlaylists.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <ListPlus className="h-5 w-5 text-primary" />
                        Playlists
                      </h2>
                      <Link to="/playlists" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredPlaylists.map(playlist => (
                        <div key={playlist.id}>
                           <PlaylistCard
                            playlist={playlist}
                            onDelete={handleDeletePlaylist}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Notes Section */}
                {filteredNotes.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Notes
                      </h2>
                      <Link to="/notes" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredNotes.map(note => (
                        <div key={note.id}>
                          <NoteCard note={note} onDelete={handleDeleteNote} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Videos Section */}
                {filteredVideos.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                      <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Video className="h-5 w-5 text-primary" />
                        Videos
                      </h2>
                      <span className="text-sm text-muted-foreground">{filteredVideos.length} Videos</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredVideos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          onDelete={handleDeleteVideo}
                        />
                      ))}
                    </div>
                  </section>
                )}

              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;