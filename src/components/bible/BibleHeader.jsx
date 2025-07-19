import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Copy, PlusCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePresentation } from '@/contexts/PresentationContext';
import { useAppState } from '@/contexts/AppStateContext';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

function BibleHeader({ view, selectedBook, selectedChapter, searchTerm, selectedVerses, goBack }) {
  const { displayContent } = usePresentation();
  const { addLog, services, setServices } = useAppState();
  const navigate = useNavigate();

  const getReferenceString = (versesArray) => {
    if (versesArray.length === 0) return '';
    const firstVerse = versesArray[0];
    const lastVerse = versesArray[versesArray.length - 1];
    return `${firstVerse.bookName} ${firstVerse.chapter}:${firstVerse.verse}${
      versesArray.length > 1 ? `-${lastVerse.verse}` : ''
    }`;
  };
  
  const displaySelectedVerses = () => {
    if (selectedVerses.length === 0) return;
    
    const reference = getReferenceString(selectedVerses);
    const versesForDisplay = selectedVerses.map(v => ({
      text: v.text,
      reference: `${v.bookName} ${v.chapter}:${v.verse}`
    }));

    const content = {
      type: 'verse',
      verses: versesForDisplay,
      currentVerseIndex: 0,
      version: 'Almeida',
    };

    displayContent(content);
    addLog(`Exibiu versículo(s): ${reference}`);
    toast({ title: 'Versículo(s) exibido(s)', description: reference });
  };

  const copySelectedVerses = () => {
    if (selectedVerses.length === 0) return;
    const reference = getReferenceString(selectedVerses);
    const textToCopy = selectedVerses.map(v => v.text).join('\n');
    navigator.clipboard.writeText(`${textToCopy}\n\n${reference} (Almeida)`);
    toast({ title: 'Copiado!', description: `${reference} copiado para a área de transferência.` });
  };

  const addVersesToService = () => {
    if (selectedVerses.length === 0) return;
    
    const reference = getReferenceString(selectedVerses);
    const newItem = {
      id: `verse-${Date.now()}`,
      type: 'verse',
      title: reference,
      data: {
        verses: selectedVerses.map(v => ({ text: v.text, reference: `${v.bookName} ${v.chapter}:${v.verse}` })),
        version: 'Almeida',
      },
    };

    if (services.length === 0) {
      const newService = {
        id: `service-${Date.now()}`,
        title: `Culto ${new Date().toLocaleDateString('pt-BR')}`,
        date: new Date().toISOString(),
        items: [newItem],
      };
      setServices([newService]);
      addLog(`Novo culto criado e versículo adicionado: ${reference}`);
      navigate(`/service/${newService.id}`);
    } else {
      const lastService = services[services.length - 1];
      const updatedServices = services.map(s => 
        s.id === lastService.id 
          ? { ...s, items: [...s.items, newItem] }
          : s
      );
      setServices(updatedServices);
      addLog(`Versículo adicionado ao culto "${lastService.title}": ${reference}`);
      navigate(`/service/${lastService.id}`);
    }
    toast({ title: 'Adicionado ao Culto', description: `${reference} foi adicionado ao planejador.` });
  };


  let title = 'Bíblia';
  if (view === 'chapters' && selectedBook) title = selectedBook.name;
  if (view === 'verses' && selectedBook && selectedChapter) title = `${selectedBook.name} ${selectedChapter}`;
  if (view === 'search') title = `Resultados para "${searchTerm}"`;

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {view !== 'books' && (
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            {view === 'books' && <BookOpen className="w-8 h-8 mr-3 text-primary" />}
            {title}
          </h1>
        </div>
        {view === 'verses' && selectedVerses.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={copySelectedVerses}>
              <Copy className="w-4 h-4 mr-2" /> Copiar ({selectedVerses.length})
            </Button>
            <Button variant="outline" size="sm" onClick={addVersesToService}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add ao Culto
            </Button>
            <Button size="sm" onClick={displaySelectedVerses}>
              <Send className="w-4 h-4 mr-2" /> Apresentar
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BibleHeader;