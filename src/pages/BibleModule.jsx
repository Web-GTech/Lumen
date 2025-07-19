import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BookOpen, Search, ArrowLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { bibleBooks } from '@/lib/bibleData';

import BibleBooksView from '@/components/bible/BibleBooksView';
import BibleChaptersView from '@/components/bible/BibleChaptersView';
import BibleVersesView from '@/components/bible/BibleVersesView';
import BibleSearchResultsView from '@/components/bible/BibleSearchResultsView';
import BibleHeader from '@/components/bible/BibleHeader';

const BIBLE_API_URL = 'https://bible-api.com/';

function BibleModule() {
  const [view, setView] = useState('books'); // books, chapters, verses, search
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerses, setSelectedVerses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  const chapters = useMemo(() => {
    if (!selectedBook) return [];
    const bookData = bibleBooks.find(b => b.name === selectedBook.name);
    if (!bookData) return [];
    return Array.from({ length: bookData.chapters }, (_, i) => i + 1);
  }, [selectedBook]);

  const fetchVerses = useCallback(async (book, chapter) => {
    setLoading(true);
    try {
      const response = await fetch(`${BIBLE_API_URL}${book.englishName}+${chapter}?translation=almeida`);
      if (!response.ok) throw new Error('Falha ao buscar versículos');
      const data = await response.json();
      setVerses(data.verses.map(v => ({...v, bookName: book.name, bookAbbrev: book.abbrev, id: `${book.abbrev}-${chapter}-${v.verse}`})));
      setSelectedVerses([]);
      setView('verses');
    } catch (error) {
      toast({ title: "Erro ao carregar Bíblia", description: "Não foi possível buscar os versículos. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setView('chapters');
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    fetchVerses(selectedBook, chapter);
  };

  const handleSearch = async () => {
    if (searchTerm.trim().length < 3) {
      toast({ title: "Busca muito curta", description: "Digite pelo menos 3 caracteres.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setView('search');
    try {
      const bookMatch = bibleBooks.find(b => b.name.toLowerCase().includes(searchTerm.trim().toLowerCase()));
      const query = bookMatch ? bookMatch.englishName : searchTerm;

      const response = await fetch(`${BIBLE_API_URL}${encodeURIComponent(query)}?translation=almeida`);
      if (!response.ok) {
        setSearchResults([]);
        toast({ title: "Nenhum resultado", description: "Não foram encontrados versículos para sua busca.", variant: "default" });
        return;
      }
      const data = await response.json();

      let results = [];
      if (data.verses) {
        results = data.verses.map(v => ({...v, bookName: data.reference.split(/(\d+)/)[0].trim() }));
      } else if (data.text) {
        results = [{...data, bookName: data.reference.split(/(\d+)/)[0].trim() }];
      }
      
      setSearchResults(results);

    } catch (err) {
      setSearchResults([]);
      toast({ title: "Erro na busca", description: "Ocorreu um erro ao realizar a busca. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (view === 'search') {
      setSearchTerm('');
      setSearchResults([]);
      setView('books');
    }
    if (view === 'verses') {
      setVerses([]);
      setView('chapters');
    }
    if (view === 'chapters') setView('books');
  };

  const renderContent = () => {
    if (loading && view !== 'search') {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <Loader2 className="w-12 h-12 animate-spin text-primary"/>
        </div>
      );
    }

    switch(view) {
      case 'books':
        return <BibleBooksView books={bibleBooks} onSelect={handleBookSelect} />;
      case 'chapters':
        return <BibleChaptersView chapters={chapters} onSelect={handleChapterSelect} />;
      case 'verses':
        return <BibleVersesView verses={verses} selectedVerses={selectedVerses} onToggle={setSelectedVerses} />;
      case 'search':
        return <BibleSearchResultsView results={searchResults} loading={loading} searchTerm={searchTerm} />;
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Bíblia - Lumen</title>
        <meta name="description" content="Navegue e apresente versículos da Bíblia." />
      </Helmet>

      <div className="p-4 md:p-6 space-y-6 h-full flex flex-col">
        <BibleHeader 
          view={view}
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
          searchTerm={searchTerm}
          selectedVerses={selectedVerses}
          goBack={goBack}
        />

        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Buscar (ex: João 3:16, Mateus ou amor)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="max-w-xs"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading && view === 'search' ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Search className="w-4 h-4 mr-2" />}
                Buscar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default BibleModule;