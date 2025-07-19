import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

function BibleBooksView({ books, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {books.map((book) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={book.abbrev}>
          <Card
            className="h-24 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors p-2"
            onClick={() => onSelect(book)}
          >
            <CardTitle className="text-base">{book.name}</CardTitle>
            <CardDescription>{book.testament}</CardDescription>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default BibleBooksView;