import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export function FavoriteVerseCard({ favorite, onDisplay }) {
  return (
    <div className="p-3 border rounded-lg hover:bg-accent">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary">{favorite.title}</span>
        <Button size="sm" variant="ghost" onClick={() => onDisplay(favorite.verse)}>
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}