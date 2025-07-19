import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Image, Upload, PlusCircle, LayoutGrid, List } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { usePresentation } from '@/contexts/PresentationContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { MediaUploadDialog } from '@/components/media/MediaUploadDialog';
import { ImageSettingsDialog } from '@/components/media/ImageSettingsDialog';
import { MediaGrid } from '@/components/media/MediaGrid';
import { MediaList } from '@/components/media/MediaList';

function MediaModule() {
  const { media, addLog, fetchAllData } = useAppState();
  const { displayContent } = usePresentation();
  const { user } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const handleImageAdd = async ({ file, name, description }) => {
    if (!user || !file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media_assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media_assets')
        .getPublicUrl(uploadData.path);
        
      const newMediaAsset = {
        user_id: user.id,
        name: name || file.name,
        description,
        file_path: uploadData.path,
        url: urlData.publicUrl,
        file_type: file.type,
      };

      const { error: dbError } = await supabase.from('media_assets').insert(newMediaAsset);

      if (dbError) throw dbError;

      toast({ title: "Upload Concluído!", description: "Sua imagem foi adicionada à biblioteca." });
      addLog(`Adicionou a mídia: "${newMediaAsset.name}"`);
      await fetchAllData();
      setIsUploadOpen(false);

    } catch (error) {
      toast({ title: "Erro no Upload", description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    const assetToDelete = media.find(item => item.id === id);
    if (!assetToDelete) return;

    try {
      const { error: storageError } = await supabase.storage.from('media_assets').remove([assetToDelete.file_path]);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from('media_assets').delete().eq('id', id);
      if (dbError) throw dbError;
      
      toast({ title: "Mídia Removida", description: "A imagem foi removida com sucesso.", variant: "destructive" });
      addLog(`Removeu a mídia: "${assetToDelete.name}"`);
      await fetchAllData();

    } catch (error) {
      toast({ title: "Erro ao Remover", description: error.message, variant: 'destructive' });
    }
  };

  const openDisplaySettings = (image) => {
    setSelectedImage(image);
    setIsSettingsOpen(true);
  };

  const displayMedia = (item) => {
    const content = { type: 'image', url: item.url, name: item.name, fit: item.fit || 'contain' };
    displayContent(content);
    addLog(`Exibiu a mídia: "${item.name}"`);
    toast({ title: "Mídia exibida", description: `"${item.name}" está sendo apresentada.` });
  };
  
  const MediaView = viewMode === 'grid' ? MediaGrid : MediaList;

  return (
    <Layout>
      <Helmet>
        <title>Mídias - Lumen</title>
        <meta name="description" content="Gerencie e apresente suas imagens e vídeos." />
      </Helmet>

      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Image className="w-8 h-8 mr-3 text-purple-600" />
              Mídias
            </h1>
            <p className="text-muted-foreground mt-1">Sua biblioteca de imagens para fundos e apresentações.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
              <List className="w-5 h-5" />
            </Button>
            <Button onClick={() => setIsUploadOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Fazer Upload
            </Button>
          </div>
        </motion.div>

        {media.length > 0 ? (
          <MediaView images={media} onDisplay={openDisplaySettings} onDelete={handleDelete} />
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-medium">Sua biblioteca está vazia</h2>
            <p className="mt-2 text-muted-foreground">Comece fazendo o upload de sua primeira imagem.</p>
            <Button className="mt-6" onClick={() => setIsUploadOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Fazer Upload Agora
            </Button>
          </div>
        )}
      </div>
      
      <MediaUploadDialog 
        isOpen={isUploadOpen}
        setIsOpen={setIsUploadOpen}
        onImageAdd={handleImageAdd}
      />
      <ImageSettingsDialog
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        image={selectedImage}
        onDisplay={displayMedia}
      />
    </Layout>
  );
}

export default MediaModule;