import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { sampleVerses } from '@/lib/bibleData';
import { usePresentation } from '@/contexts/PresentationContext';
import { QuickVerseCard } from './QuickVerseCard';
import { FavoriteVerseCard } from './FavoriteVerseCard';

function BibleSidebar() {
  const [favorites, setFavorites] = useState([]);
  const { displayContent } = usePresentation();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('lumen-bible-favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const displayVerse = (verse) => {
    const content = {
      type: 'verse',
      content: verse.text,
      reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
      version: verse.version
    };
    displayContent(content);
    toast({ title: "Versículo exibido", description: `${verse.book} ${verse.chapter}:${verse.verse} está sendo apresentado.` });
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Versículos Populares</CardTitle>
            <CardDescription>Versículos frequentemente utilizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleVerses.slice(0, 3).map((verse) => (
              <QuickVerseCard key={verse.id} verse={verse} onDisplay={displayVerse} />
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500" />Favoritos</CardTitle>
            <CardDescription>Seus versículos favoritos</CardDescription>
          </CardHeader>
          <CardContent>
            {favorites.length > 0 ? (
              <div className="space-y-3">
                {favorites.slice(0, 5).map((favorite) => (
                  <FavoriteVerseCard key={favorite.id} favorite={favorite} onDisplay={displayVerse} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum favorito adicionado</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}

export default BibleSidebar;