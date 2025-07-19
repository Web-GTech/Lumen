import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ImageSettingsDialog({ isOpen, setIsOpen, image, onDisplay }) {
  const [fitMode, setFitMode] = useState('contain');

  useEffect(() => {
    if (!isOpen) {
      setFitMode('contain');
    }
  }, [isOpen]);

  if (!image) return null;

  const handleDisplay = () => {
    onDisplay({ ...image, fit: fitMode });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Opções de Exibição: {image.name}</DialogTitle>
          <DialogDescription>
            Escolha como a imagem será exibida na tela de apresentação.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="aspect-video w-full rounded-md overflow-hidden bg-muted flex items-center justify-center">
            <img 
              src={image.url} 
              alt={`Pré-visualização de ${image.name}`}
              className="max-w-full max-h-full"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fit-mode" className="text-right">
              Ajuste
            </Label>
            <Select value={fitMode} onValueChange={setFitMode}>
              <SelectTrigger id="fit-mode" className="col-span-3">
                <SelectValue placeholder="Selecione o ajuste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Ajustar (Manter proporção)</SelectItem>
                <SelectItem value="cover">Preencher (Recortar para caber)</SelectItem>
                <SelectItem value="fill">Esticar (Preencher a tela)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleDisplay}>Exibir em Tela Cheia</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}