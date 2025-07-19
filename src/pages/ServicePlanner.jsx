import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CalendarPlus, ListOrdered, GripVertical, Trash2, BookOpen, Music, Image as ImageIcon, Send, Star, Edit } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppState } from '@/contexts/AppStateContext';
import { usePresentation } from '@/contexts/PresentationContext';
import { toast } from '@/components/ui/use-toast';
import { SortableItem } from '@/components/SortableItem';
import { AddItemDialog } from '@/components/AddItemDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

function ServicePlanner() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { services, setServices, songs, media, addLog } = useAppState();
  const { displayContent } = usePresentation();
  const [service, setService] = useState(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const currentService = services.find(s => s.id === serviceId);
    if (currentService) {
      setService(currentService);
    } else {
      navigate('/');
    }
  }, [serviceId, services, navigate]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id && service) {
      const oldIndex = service.items.findIndex((item) => item.id === active.id);
      const newIndex = service.items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(service.items, oldIndex, newIndex);
      updateServiceItems(newItems);
    }
  };

  const updateServiceItems = (items) => {
    if (!service) return;
    const updatedService = { ...service, items };
    setService(updatedService);
    const updatedServices = services.map(s => s.id === serviceId ? updatedService : s);
    setServices(updatedServices);
  };

  const handleTitleChange = (e) => {
    if (!service) return;
    const newTitle = e.target.value;
    const updatedService = { ...service, title: newTitle };
    setService(updatedService);
    const updatedServices = services.map(s => s.id === serviceId ? updatedService : s);
    setServices(updatedServices);
  };

  const handleAddItem = (item) => {
    if (!service) return;
    const newItem = { ...item, id: `item-${Date.now()}` };
    if (item.type === 'event') {
      newItem.data = { content: item.subtitle || '' };
      newItem.subtitle = '';
    }
    updateServiceItems([...service.items, newItem]);
    addLog(`Adicionou item "${item.title || item.name}" ao culto "${service.title}"`);
    toast({ title: "Item adicionado ao culto!" });
  };

  const handleRemoveItem = (itemId) => {
    if (!service) return;
    const itemToRemove = service.items.find(item => item.id === itemId);
    if(itemToRemove) {
      addLog(`Removeu item "${itemToRemove.title || itemToRemove.name}" do culto "${service.title}"`);
      toast({ title: "Item removido do culto", variant: "destructive" });
    }
    updateServiceItems(service.items.filter(item => item.id !== itemId));
  };

  const handlePresentItem = (item) => {
    if (!service) return;
    let content;

    switch (item.type) {
      case 'verse':
        content = {
          type: 'verse',
          verses: item.data.verses,
          currentVerseIndex: 0,
          version: item.data.version || 'Almeida',
        };
        break;
      case 'song':
        const paragraphs = item.lyrics.split(/\n\s*\n/).filter(p => p.trim() !== '');
        const sections = paragraphs.map((p, index) => ({
          title: `Parte ${index + 1}`,
          content: p.trim()
        }));

        content = {
          type: 'song',
          title: item.title,
          author: item.author,
          sections: sections.length > 0 ? sections : [{ title: 'Letra', content: item.lyrics }],
          currentSection: 0,
        };
        break;
      case 'image':
        content = { type: 'image', url: item.url, name: item.name };
        break;
      case 'event':
        content = {
          type: 'event',
          title: item.title,
          subtitle: item.data?.content,
        };
        break;
      default:
        toast({ title: "Tipo de item não suportado", variant: "destructive" });
        return;
    }

    displayContent(content);
    addLog(`Apresentando "${item.title || item.name}" do culto "${service.title}"`);
    toast({ title: "Item em apresentação", description: item.title || item.name });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    updateServiceItems(service.items.map(item => item.id === editingItem.id ? editingItem : item));
    setEditingItem(null);
    toast({ title: "Item atualizado com sucesso!" });
  };

  if (!service) {
    return <Layout><div>Carregando...</div></Layout>;
  }

  const renderIcon = (type) => {
    switch (type) {
      case 'verse': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'song': return <Music className="w-5 h-5 text-green-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case 'event': return <Star className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{service.title} - Planejador de Cultos</title>
        <meta name="description" content={`Planeje e organize o culto: ${service.title}`} />
      </Helmet>

      <div className="p-4 md:p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4">
            <ListOrdered className="w-8 h-8 text-orange-500" />
            <Input
              value={service.title}
              onChange={handleTitleChange}
              className="text-3xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
            />
          </div>
          <p className="text-muted-foreground mt-1 ml-12">
            Organize a sequência da sua apresentação arrastando os itens.
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Itens do Culto</CardTitle>
              <Button onClick={() => setIsAddItemOpen(true)}>
                <CalendarPlus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {service.items.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={service.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {service.items.map(item => (
                      <SortableItem key={item.id} id={item.id}>
                        <div className="flex items-center gap-2 md:gap-4 p-3 bg-background rounded-lg border">
                          <GripVertical className="cursor-grab text-muted-foreground touch-none" />
                          <div className="w-8 flex-shrink-0">{renderIcon(item.type)}</div>
                          <div className="flex-grow">
                            <p className="font-medium">{item.title || item.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">{item.type === 'event' ? item.data?.content : (item.subtitle || item.author)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.type === 'event' && (
                              <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                                <Edit className="w-4 h-4 text-blue-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                            <Button size="sm" onClick={() => handlePresentItem(item)}>
                              <Send className="w-4 h-4 md:mr-2" />
                              <span className="hidden md:inline">Apresentar</span>
                            </Button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Este culto ainda não tem itens.</p>
                <Button onClick={() => setIsAddItemOpen(true)} className="mt-4">Adicionar primeiro item</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <AddItemDialog
        isOpen={isAddItemOpen}
        setIsOpen={setIsAddItemOpen}
        onAddItem={handleAddItem}
        songs={songs}
        media={media}
      />
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Item: {editingItem.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="item-title">Título</label>
                <Input
                  id="item-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="item-content">Conteúdo</label>
                <Textarea
                  id="item-content"
                  value={editingItem.data.content}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: e.target.value } })}
                  rows={5}
                  placeholder="Adicione aqui informações do PIX, avisos, versículos, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>Cancelar</Button>
              <Button onClick={handleUpdateItem}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}

export default ServicePlanner;