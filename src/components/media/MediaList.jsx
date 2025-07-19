import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

export function MediaList({ images, onDisplay, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center p-3 hover:bg-accent"
              >
                <div className="w-20 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0 bg-muted">
                  <img  
                    className="w-full h-full object-cover"
                    alt={image.description || image.name}
                    src={image.url} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{image.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{image.description || 'Sem descrição'}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mx-4">
                    <span>{new Date(image.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" onClick={() => onDisplay(image)}><Eye className="w-4 h-4 mr-2" />Exibir</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(image.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}