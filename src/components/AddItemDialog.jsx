import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Music, Image as ImageIcon, Star, Briefcase, MessageSquare, HeartHandshake, Users, Heart, AlertCircle } from 'lucide-react';
import { bibleVerses } from '@/lib/bibleData';

const eventItems = [
  { title: "Momento Ofertório", subtitle: "Contribuição e Adoração", icon: Briefcase, type: 'event' },
  { title: "Intercessão", subtitle: "Clamor pela Igreja e pelo Mundo", icon: MessageSquare, type: 'event' },
  { title: "Oração", subtitle: "Comunhão com Deus", icon: HeartHandshake, type: 'event' },
  { title: "Momento da Família", subtitle: "Edificação do Lar", icon: Users, type: 'event' },
  { title: "Momento Comunhão", subtitle: "Celebração e União", icon: Heart, type: 'event' },
  { title: "Aviso", subtitle: "Informações importantes", icon: AlertCircle, type: 'event' },
];

export function AddItemDialog({ isOpen, setIsOpen, onAddItem, songs, media }) {
  const [activeTab, setActiveTab] = useState('bible');
  const [bibleSearch, setBibleSearch] = useState('');
  const [songSearch, setSongSearch] = useState('');
  const [mediaSearch, setMediaSearch] = useState('');

  const filteredBibleVerses = useMemo(() => {
    if (!bibleSearch) return [];
    return bibleVerses.filter(verse => 
      verse.text.toLowerCase().includes(bibleSearch.toLowerCase()) ||
      `${verse.bookName} ${verse.chapter}:${verse.verse}`.toLowerCase().includes(bibleSearch.toLowerCase())
    ).slice(0, 50);
  }, [bibleSearch]);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => song.title.toLowerCase().includes(songSearch.toLowerCase()));
  }, [songs, songSearch]);

  const filteredMedia = useMemo(() => {
    return media.filter(item => item.name.toLowerCase().includes(mediaSearch.toLowerCase()));
  }, [media, mediaSearch]);

  const handleSelect = (item) => {
    let itemToAdd = { ...item };
    if (item.type === 'verse') {
      itemToAdd.title = `${item.bookName} ${item.chapter}:${item.verse}`;
      itemToAdd.reference = itemToAdd.title;
    }
    onAddItem(itemToAdd);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Culto</DialogTitle>
          <DialogDescription>Selecione um item para adicionar à sequência do culto.</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bible"><BookOpen className="w-4 h-4 mr-2" />Bíblia</TabsTrigger>
            <TabsTrigger value="songs"><Music className="w-4 h-4 mr-2" />Músicas</TabsTrigger>
            <TabsTrigger value="media"><ImageIcon className="w-4 h-4 mr-2" />Mídias</TabsTrigger>
            <TabsTrigger value="events"><Star className="w-4 h-4 mr-2" />Eventos</TabsTrigger>
          </TabsList>
          <TabsContent value="bible">
            <div className="p-1 space-y-4">
              <Input placeholder="Buscar versículo (ex: João 3:16 ou amor)" value={bibleSearch} onChange={(e) => setBibleSearch(e.target.value)} />
              <ScrollArea className="h-72">
                <div className="space-y-2 pr-4">
                  {filteredBibleVerses.map((verse) => (
                    <div key={verse.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                      <div>
                        <p className="font-medium">{verse.bookName} {verse.chapter}:{verse.verse}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-md">{verse.text}</p>
                      </div>
                      <Button size="sm" onClick={() => handleSelect({ ...verse, type: 'verse' })}>Adicionar</Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="songs">
            <div className="p-1 space-y-4">
              <Input placeholder="Buscar música..." value={songSearch} onChange={(e) => setSongSearch(e.target.value)} />
              <ScrollArea className="h-72">
                <div className="space-y-2 pr-4">
                  {filteredSongs.map(song => (
                    <div key={song.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-muted-foreground">{song.author}</p>
                      </div>
                      <Button size="sm" onClick={() => handleSelect({ type: 'song', ...song })}>Adicionar</Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="media">
            <div className="p-1 space-y-4">
              <Input placeholder="Buscar mídia..." value={mediaSearch} onChange={(e) => setMediaSearch(e.target.value)} />
              <ScrollArea className="h-72">
                <div className="grid grid-cols-3 gap-4 pr-4">
                  {filteredMedia.map(item => (
                    <div key={item.id} className="relative group cursor-pointer" onClick={() => handleSelect({ type: 'image', title: item.name, ...item })}>
                      <img src={item.url} alt={item.name} className="w-full h-24 object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-center text-sm p-1">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="events">
             <div className="p-1 space-y-4">
              <ScrollArea className="h-72">
                <div className="space-y-2 pr-4">
                  {eventItems.map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleSelect(item)}>Adicionar</Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}