import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

export function MediaGrid({ images, onDisplay, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img  
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt={image.description || image.name}
                src={image.url} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button size="icon" onClick={() => onDisplay(image)} className="bg-white/90 text-black hover:bg-white"><Eye className="w-5 h-5" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => onDelete(image.id)} className="bg-red-500/90 hover:bg-red-500"><Trash2 className="w-5 h-5" /></Button>
                </div>
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm text-foreground line-clamp-1">{image.name}</h3>
              {image.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{image.description}</p>}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}