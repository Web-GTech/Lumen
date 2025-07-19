import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

export function MediaUploadDialog({ isOpen, setIsOpen, onImageAdd }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      if (!name) setName(selectedFile.name.split('.').slice(0, -1).join('.'));
    } else {
      setFile(null);
      toast({ title: "Formato inválido", description: "Por favor, selecione apenas arquivos de imagem.", variant: "destructive" });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "Arquivo faltando", description: "Por favor, selecione um arquivo de imagem para upload.", variant: "destructive" });
      return;
    }
    await onImageAdd({ file, name, description });
    resetAndClose();
  };

  const resetAndClose = () => {
    setFile(null);
    setName('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent onEscapeKeyDown={resetAndClose} onPointerDownOutside={resetAndClose}>
        <DialogHeader>
          <DialogTitle>Upload de Nova Mídia</DialogTitle>
          <DialogDescription>Adicione uma nova imagem à sua biblioteca.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="imageFile">Arquivo de Imagem</Label>
            <Input id="imageFile" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
            {file && <p className="text-xs text-muted-foreground">Selecionado: {file.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageName">Nome da Mídia</Label>
            <Input id="imageName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Fundo Abstrato Azul" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageDescription">Descrição</Label>
            <Textarea id="imageDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição opcional da imagem (para sua referência)" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
          <Button onClick={handleUpload} disabled={!file}>Fazer Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}