import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Music, PlusCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePresentation } from '@/contexts/PresentationContext';
import { useAppState } from '@/contexts/AppStateContext';
import { toast } from '@/components/ui/use-toast';
import { SongDialog } from '@/components/songs/SongDialog';
import { SongCard } from '@/components/songs/SongCard';

function SongsModule() {
  const { songs, setSongs, addLog, fetchAllData } = useAppState();
  const [isSongDialogOpen, setIsSongDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const { displayContent } = usePresentation();

  const openExternalSearch = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    addLog(`Abriu site externo para busca: ${url}`);
  };

  const handleAddNewSong = () => {
    setEditingSong(null);
    setIsSongDialogOpen(true);
  };

  const handleEditSong = (song) => {
    setEditingSong(song);
    setIsSongDialogOpen(true);
  };

  const handleSaveSong = async (songData) => {
    try {
      if (songData.id) {
        const { error } = await supabase.from('songs').update(songData).eq('id', songData.id);
        if (error) throw error;
        addLog(`Atualizou a música: "${songData.title}"`);
        toast({ title: "Música atualizada!", description: `"${songData.title}" foi atualizada no seu repertório.` });
      } else {
        const { error } = await supabase.from('songs').insert(songData);
        if (error) throw error;
        addLog(`Salvou a música: "${songData.title}"`);
        toast({ title: "Música salva!", description: `"${songData.title}" foi adicionada ao seu repertório.` });
      }
      fetchAllData();
      setIsSongDialogOpen(false);
      setEditingSong(null);
    } catch (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteSong = async (songId) => {
    const songToDelete = songs.find(s => s.id === songId);
    if (!songToDelete) return;

    try {
      const { error } = await supabase.from('songs').delete().eq('id', songId);
      if (error) throw error;
      addLog(`Removeu a música: "${songToDelete.title}"`);
      toast({ title: "Música removida", variant: "destructive" });
      fetchAllData();
    } catch (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: 'destructive' });
    }
  };

  const displaySong = (song) => {
    const paragraphs = song.lyrics.split(/\n\s*\n/).filter(p => p.trim() !== '');
    
    const sections = paragraphs.map((p, index) => ({
      title: `Parte ${index + 1}`,
      content: p.trim()
    }));

    const content = {
      type: 'song',
      title: song.title,
      author: song.author,
      sections: sections.length > 0 ? sections : [{ title: 'Letra', content: song.lyrics }],
      currentSection: 0
    };
    
    displayContent(content);
    addLog(`Exibiu a música: "${song.title}"`);
    toast({ title: "Música exibida", description: `"${song.title}" está sendo apresentada.` });
  };
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  const categories = useMemo(() => ["Todas", ...new Set(songs.map(s => s.category))], [songs]);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesCategory = activeCategory === "Todas" || song.category === activeCategory;
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.author && song.author.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [songs, searchQuery, activeCategory]);

  return (
    <Layout>
      <Helmet>
        <title>Músicas - Lumen</title>
        <meta name="description" content="Busque, salve e apresente letras de músicas." />
      </Helmet>

      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Music className="w-8 h-8 mr-3 text-green-600" />
            Músicas
          </h1>
          <p className="text-muted-foreground mt-1">Busque letras e cifras, copie e cole para adicionar ao seu repertório.</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Música</CardTitle>
            <CardDescription>Busque em sites externos, copie o conteúdo e adicione ao seu repertório.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => openExternalSearch('https://www.letras.mus.br/')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Buscar Letra no Letras.mus.br
            </Button>
            <Button variant="outline" onClick={() => openExternalSearch('https://www.cifraclub.com.br/')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Buscar Cifra no CifraClub
            </Button>
            <Button onClick={handleAddNewSong}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar Música Manualmente
            </Button>
          </CardContent>
        </Card>

        <SongDialog
          isOpen={isSongDialogOpen}
          setIsOpen={setIsSongDialogOpen}
          song={editingSong}
          onSave={handleSaveSong}
          categories={['Louvor', 'Adoração', 'Hino', 'Especial']}
        />

        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-foreground">Repertório Salvo</h2>
                <div className="flex gap-2 items-center flex-wrap">
                    <div className="w-full sm:w-64">
                        <Input 
                            placeholder="Buscar no repertório..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </Button>
              ))}
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSongs.length > 0 ? filteredSongs.map(song => (
              <SongCard 
                key={song.id} 
                song={song} 
                onDisplay={() => displaySong(song)} 
                onEdit={() => handleEditSong(song)} 
                onDelete={() => handleDeleteSong(song.id)}
              />
            )) : (
              <p className="text-center text-muted-foreground py-8 col-span-full">
                {songs.length > 0 ? "Nenhuma música encontrada com esses filtros." : "Nenhuma música no seu repertório. Adicione uma para começar!"}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SongsModule;