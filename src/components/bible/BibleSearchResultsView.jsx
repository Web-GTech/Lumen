import React from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePresentation } from '@/contexts/PresentationContext';
import { useAppState } from '@/contexts/AppStateContext';
import { toast } from '@/components/ui/use-toast';

function BibleSearchResultsView({ results, loading, searchTerm }) {
  const { displayContent } = usePresentation();
  const { addLog } = useAppState();

  const displaySingleVerse = (verse) => {
    const bookName = verse.book_name || verse.bookName;
    const reference = `${bookName} ${verse.chapter}:${verse.verse}`;
    const content = {
      type: 'verse',
      verses: [{ text: verse.text, reference }],
      currentVerseIndex: 0,
      version: 'Almeida',
    };
    displayContent(content);
    addLog(`Exibiu versículo: ${reference}`);
    toast({ title: 'Versículo exibido', description: reference });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="w-12 h-12 animate-spin text-primary"/>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.length > 0 ? (
        results.map((verse, index) => (
          <div key={`${verse.book_name}-${verse.chapter}-${verse.verse}-${index}`} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="font-semibold text-primary">
                {verse.book_name || verse.bookName} {verse.chapter}:{verse.verse}
              </h3>
              <Button size="sm" onClick={() => displaySingleVerse(verse)}>
                <Send className="w-4 h-4 mr-2" />
                Apresentar
              </Button>
            </div>
            <p
              className="text-foreground"
              dangerouslySetInnerHTML={{
                __html: verse.text.replace(
                  new RegExp(searchTerm.split(" ")[0], 'gi'),
                  (match) => `<strong class="bg-yellow-200 dark:bg-yellow-700 rounded px-1">${match}</strong>`
                ),
              }}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">Nenhum resultado encontrado para "{searchTerm}".</p>
      )}
    </div>
  );
}

export default BibleSearchResultsView;