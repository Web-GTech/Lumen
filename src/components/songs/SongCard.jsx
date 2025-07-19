import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Folder } from 'lucide-react';

export function SongCard({ song, onDisplay, onEdit, onDelete }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{song.title}</CardTitle>
            <CardDescription className="mt-1">
              {song.author && `Por ${song.author}`}
              {song.key && ` • Tom: ${song.key}`}
            </CardDescription>
          </div>
          <div className="flex space-x-1 ml-2">
            <Button size="sm" variant="ghost" onClick={onEdit}><Edit className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Folder className="w-3 h-3 mr-1" />
            {song.category}
          </span>
        </div>
        {song.tags && (
          <div className="flex flex-wrap gap-1">
            {song.tags.split(',').map((tag, tagIndex) => (
              <span key={tagIndex} className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        <div className="pt-2">
          <Button onClick={onDisplay} className="w-full" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Apresentar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}