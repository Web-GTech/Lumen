import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export function QuickVerseCard({ verse, onDisplay }) {
  return (
    <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => onDisplay(verse)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-primary">
          {verse.book} {verse.chapter}:{verse.verse}
        </span>
        <Button size="sm" variant="ghost" className="pointer-events-none">
          <Eye className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {verse.text}
      </p>
    </div>
  );
}