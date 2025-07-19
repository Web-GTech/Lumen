import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Star, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function BibleVerseCard({ verse, isFavorite, onDisplay, onToggleFavorite }) {
  const copyVerse = (verseToCopy) => {
    const text = `${verseToCopy.text}\n\n${verseToCopy.book} ${verseToCopy.chapter}:${verseToCopy.verse} (${verseToCopy.version})`;
    navigator.clipboard.writeText(text);
    toast({ title: "Versículo copiado", description: "Texto copiado para a área de transferência." });
  };

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary">
          {verse.book} {verse.chapter}:{verse.verse} ({verse.version})
        </h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onToggleFavorite(verse)}>
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
          <Button size="sm" variant="outline" onClick={() => copyVerse(verse)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={() => onDisplay(verse)}>
            <Eye className="w-4 h-4 mr-2" />
            Exibir
          </Button>
        </div>
      </div>
      <p className="text-foreground leading-relaxed">{verse.text}</p>
    </div>
  );
}