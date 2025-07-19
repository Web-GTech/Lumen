import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export function SongDialog({ isOpen, setIsOpen, song, onSave, categories }) {
  const [songData, setSongData] = useState({ title: '', author: '', key: '', category: 'Louvor', lyrics: '', tags: '' });

  useEffect(() => {
    if (isOpen) {
      if (song) {
        setSongData(song);
      } else {
        setSongData({ id: null, title: '', author: '', key: '', category: 'Louvor', lyrics: '', tags: '' });
      }
    }
  }, [song, isOpen]);

  const handleSave = () => {
    if (!songData.title || !songData.lyrics) {
      toast({ title: "Campos obrigatórios", description: "Título e letra são obrigatórios.", variant: "destructive" });
      return;
    }
    onSave(songData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{song ? 'Editar Música' : 'Nova Música'}</DialogTitle>
          <DialogDescription>{song ? 'Edite as informações da música' : 'Adicione uma nova música ao repertório'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={songData.title} onChange={(e) => setSongData({...songData, title: e.target.value})} placeholder="Nome da música" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input id="author" value={songData.author} onChange={(e) => setSongData({...songData, author: e.target.value})} placeholder="Nome do autor/compositor" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key">Tom</Label>
              <Input id="key" value={songData.key} onChange={(e) => setSongData({...songData, key: e.target.value})} placeholder="Ex: C, G, Am" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={songData.category} onValueChange={(value) => setSongData({...songData, category: value})}>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" value={songData.tags} onChange={(e) => setSongData({...songData, tags: e.target.value})} placeholder="Ex: adoração, louvor (separadas por vírgula)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lyrics">Letra e Cifras *</Label>
            <Textarea id="lyrics" value={songData.lyrics} onChange={(e) => setSongData({...songData, lyrics: e.target.value})} placeholder="Cole ou digite a letra aqui..." className="min-h-[200px] font-mono" />
            <p className="text-xs text-muted-foreground">Use uma linha em branco para separar os parágrafos/estrofes para apresentação.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{song ? 'Atualizar' : 'Adicionar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}