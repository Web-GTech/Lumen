import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { BibleVerseCard } from '@/components/bible/BibleVerseCard';
import { bibleVersions, bibleBooks, sampleVerses } from '@/lib/bibleData';
import { usePresentation } from '@/contexts/PresentationContext';

function BibleSearchPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('NVI');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { displayContent } = usePresentation();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('lumen-bible-favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = sampleVerses.filter(v => 
        v.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.book.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleVerseSearch = () => {
    if (selectedBook && selectedChapter && selectedVerse) {
      const result = sampleVerses.find(v => 
        v.book === selectedBook && 
        v.chapter.toString() === selectedChapter && 
        v.verse.toString() === selectedVerse
      );
      if (result) {
        setSearchResults([result]);
      } else {
        toast({ title: "Versículo não encontrado", description: "Tente uma referência diferente.", variant: "destructive" });
      }
    }
  };

  const displayVerse = (verse) => {
    const content = {
      type: 'verse',
      content: verse.text,
      reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
      version: verse.version
    };
    displayContent(content);
    
    const recent = JSON.parse(localStorage.getItem('lumen-recent') || '[]');
    const newItem = {
      type: 'verse',
      title: `${verse.book} ${verse.chapter}:${verse.verse}`,
      subtitle: verse.version,
      timestamp: new Date().toISOString()
    };
    const updatedRecent = [newItem, ...recent.filter(item => item.title !== newItem.title)].slice(0, 10);
    localStorage.setItem('lumen-recent', JSON.stringify(updatedRecent));
    
    toast({ title: "Versículo exibido", description: `${verse.book} ${verse.chapter}:${verse.verse} está sendo apresentado.` });
  };

  const toggleFavorite = (verse) => {
    const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
    const isFavorite = favorites.some(fav => fav.id === verseId);
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== verseId);
      toast({ title: "Removido dos favoritos", description: `${verse.book} ${verse.chapter}:${verse.verse}` });
    } else {
      updatedFavorites = [...favorites, { id: verseId, title: `${verse.book} ${verse.chapter}:${verse.verse}`, subtitle: verse.version, verse: verse }];
      toast({ title: "Adicionado aos favoritos", description: `${verse.book} ${verse.chapter}:${verse.verse}` });
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('lumen-bible-favorites', JSON.stringify(updatedFavorites));
  };
  
  const isFavorite = (verse) => favorites.some(fav => fav.id === `${verse.book}-${verse.chapter}-${verse.verse}`);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader><CardTitle className="text-lg">Versão da Bíblia</CardTitle></CardHeader>
          <CardContent>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger><SelectValue placeholder="Selecione uma versão" /></SelectTrigger>
              <SelectContent>
                {bibleVersions.map((version) => (
                  <SelectItem key={version.value} value={version.value}>{version.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Busca por Palavra-chave</CardTitle>
            <CardDescription>Digite uma palavra ou frase para encontrar versículos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ex: amor, paz, esperança..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}><Search className="w-4 h-4 mr-2" />Buscar</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Busca por Referência</CardTitle>
            <CardDescription>Selecione livro, capítulo e versículo específico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger><SelectValue placeholder="Livro" /></SelectTrigger>
                <SelectContent>
                  {bibleBooks.map((book) => (<SelectItem key={book} value={book}>{book}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input placeholder="Capítulo" value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} type="number" min="1" />
              <Input placeholder="Versículo" value={selectedVerse} onChange={(e) => setSelectedVerse(e.target.value)} type="number" min="1" />
              <Button onClick={handleVerseSearch}><Search className="w-4 h-4 mr-2" />Buscar</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {searchResults.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultados da Busca</CardTitle>
              <CardDescription>{searchResults.length} versículo(s) encontrado(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {searchResults.map((verse) => (
                <BibleVerseCard 
                  key={verse.id} 
                  verse={verse} 
                  isFavorite={isFavorite(verse)}
                  onDisplay={displayVerse} 
                  onToggleFavorite={toggleFavorite} 
                />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}

export default BibleSearchPanel;