import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square } from 'lucide-react';

function BibleVersesView({ verses, selectedVerses, onToggle }) {
  const handleVerseToggle = (verse) => {
    onToggle((prev) => {
      const isSelected = prev.some((v) => v.verse === verse.verse);
      if (isSelected) {
        return prev.filter((v) => v.verse !== verse.verse);
      } else {
        return [...prev, verse].sort((a, b) => a.verse - b.verse);
      }
    });
  };

  return (
    <div className="space-y-1">
      {verses.map((verse) => {
        const isSelected = selectedVerses.some((v) => v.verse === verse.verse);
        return (
          <motion.div
            key={verse.verse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            layout
            onClick={() => handleVerseToggle(verse)}
            className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
              isSelected ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-accent'
            }`}
          >
            <div className="flex items-center gap-2 pt-1">
              <span className="font-bold text-primary w-6 text-center">{verse.verse}</span>
              <AnimatePresence>
                {isSelected ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </motion.div>
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground" />
                )}
              </AnimatePresence>
            </div>
            <p className="flex-1 text-foreground leading-relaxed">{verse.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export default BibleVersesView;