import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

function BibleChaptersView({ chapters, onSelect }) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
      {chapters.map((chapter) => (
         <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} key={chapter}>
          <Button
            variant="outline"
            className="h-14 w-14 text-lg"
            onClick={() => onSelect(chapter)}
          >
            {chapter}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export default BibleChaptersView;