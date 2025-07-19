import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Palette, Image as ImageIcon, Type, MoveHorizontal, MonitorPlay, Tv2, Upload, Sparkles, Film } from 'lucide-react';

import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePresentation } from '@/contexts/PresentationContext';
import { useAppState } from '@/contexts/AppStateContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';


const backgroundColors = [
    { name: 'Gradiente (Padrão)', value: 'gradient', class: 'bg-gradient-to-br from-blue-600 to-purple-800' },
    { name: 'Escuro', value: 'dark', class: 'bg-gray-900' },
    { name: 'Claro', value: 'light', class: 'bg-gray-100' },
    { name: 'Azul Escuro', value: '#0d1b2a', class: 'bg-[#0d1b2a]' },
];

function SettingsPage() {
  const { presentationSettings, updateSettings } = usePresentation();
  const { media, fetchAllData } = useAppState();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };
  
  const handlePresentationSettingChange = (key, value) => {
    updateSettings({
      presentation: {
        ...presentationSettings,
        [key]: value
      }
    });
  }

  const handleIdleScreenChange = (key, value) => {
    updateSettings({
      presentation: {
        ...presentationSettings,
        idleScreen: {
          ...presentationSettings.idleScreen,
          [key]: value,
        },
      }
    });
  };
  
  const handleBgTypeChange = (type) => {
    handlePresentationSettingChange('backgroundType', type);
  }

  const handleCustomImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media_assets')
        .getPublicUrl(uploadData.path);
        
      const newMediaAsset = {
        user_id: user.id, name: file.name, file_path: uploadData.path,
        url: urlData.publicUrl, file_type: file.type,
      };

      const { error: dbError } = await supabase.from('media_assets').insert(newMediaAsset);
      if (dbError) throw dbError;
      
      await fetchAllData();
      handlePresentationSettingChange('backgroundUrl', urlData.publicUrl);
      handleBgTypeChange('image');
      toast({ title: "Imagem de fundo atualizada!", description: "Sua imagem foi enviada e aplicada." });

    } catch (error) {
      toast({ title: "Erro no Upload", description: error.message, variant: 'destructive' });
    }
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Configurações - Lumen</title>
        <meta name="description" content="Personalize a aparência e o comportamento do Lumen." />
      </Helmet>
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Ajuste as preferências do sistema de apresentação.</p>
        </motion.div>

        <Tabs defaultValue="appearance">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appearance"><Palette className="w-4 h-4 mr-2" />Aparência</TabsTrigger>
            <TabsTrigger value="idle-screen"><MonitorPlay className="w-4 h-4 mr-2" />Tela de Espera</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Palette className="w-6 h-6 mr-3 text-red-500" />Aparência da Apresentação</CardTitle>
                <CardDescription>Personalize a tela que será exibida no telão durante a apresentação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <Label className="text-lg font-semibold flex items-center"><ImageIcon className="w-5 h-5 mr-2" /> Fundo da Tela</Label>
                  
                  <div>
                      <h3 className="font-medium mb-2">Cores</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {backgroundColors.map(color => (
                              <button key={color.value} onClick={() => { handleBgTypeChange('color'); handlePresentationSettingChange('backgroundColor', color.value); }} className={cn("h-20 w-full rounded-lg border-2 transition-all flex items-center justify-center text-center p-2", presentationSettings.backgroundType === 'color' && presentationSettings.backgroundColor === color.value ? 'border-primary ring-2 ring-primary' : 'border-transparent')}>
                                  <div className={cn("w-full h-full rounded-md", color.class)}></div>
                              </button>
                          ))}
                          <div className="relative">
                            <button onClick={() => handleBgTypeChange('color')} className={cn("h-20 w-full rounded-lg border-2 transition-all flex items-center justify-center text-center p-2", presentationSettings.backgroundType === 'color' && !backgroundColors.some(c => c.value === presentationSettings.backgroundColor) ? 'border-primary ring-2 ring-primary' : 'border-transparent')}>
                                <div className="w-full h-full rounded-md flex items-center justify-center" style={{ backgroundColor: presentationSettings.backgroundColor }}>
                                  <Sparkles className="w-6 h-6 text-white/80" />
                                </div>
                            </button>
                            <Input 
                                type="color" 
                                value={typeof presentationSettings.backgroundColor === 'string' && presentationSettings.backgroundColor.startsWith('#') ? presentationSettings.backgroundColor : '#000000'}
                                onChange={(e) => { handleBgTypeChange('color'); handlePresentationSettingChange('backgroundColor', e.target.value); }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                      </div>
                  </div>

                  <div>
                      <h3 className="font-medium mb-2">Imagens da Biblioteca</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {media.slice(0, 7).map(image => (
                              <button key={image.id} onClick={() => { handleBgTypeChange('image'); handlePresentationSettingChange('backgroundUrl', image.url); }} className={cn("h-20 w-full rounded-lg border-2 transition-all bg-cover bg-center", presentationSettings.backgroundType === 'image' && presentationSettings.backgroundUrl === image.url ? 'border-primary ring-2 ring-primary' : 'border-transparent')} style={{backgroundImage: `url(${image.url})`}}>
                                <div className="w-full h-full bg-black/20" />
                              </button>
                          ))}
                          <button onClick={() => fileInputRef.current?.click()} className="h-20 w-full rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-2 text-muted-foreground hover:border-primary hover:text-primary">
                            <Upload className="w-6 h-6 mb-1" />
                            <span className="text-xs">Enviar Nova</span>
                          </button>
                          <Input type="file" ref={fileInputRef} onChange={handleCustomImageUpload} accept="image/*" className="hidden" />
                      </div>
                  </div>

                  {presentationSettings.backgroundType === 'image' && (
                    <div>
                      <Label htmlFor="bg-opacity">Opacidade da Imagem de Fundo</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="bg-opacity"
                          min={0.1}
                          max={1}
                          step={0.1}
                          value={[presentationSettings.backgroundOpacity || 1]}
                          onValueChange={([value]) => handlePresentationSettingChange('backgroundOpacity', value)}
                        />
                        <span className="font-bold w-16 text-center">{Math.round((presentationSettings.backgroundOpacity || 1) * 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 pt-6 border-t">
                  <div className="space-y-4">
                    <Label htmlFor="font-family" className="text-lg font-semibold flex items-center"><Type className="w-5 h-5 mr-2" /> Tipografia</Label>
                    <Select
                      value={presentationSettings.fontFamily}
                      onValueChange={(value) => handlePresentationSettingChange('fontFamily', value)}
                    >
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Selecione a fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, sans-serif">Inter (Padrão)</SelectItem>
                        <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                        <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
                        <SelectItem value="Lato, sans-serif">Lato</SelectItem>
                        <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="space-y-2">
                        <Label>Cor do Texto</Label>
                        <Input 
                            type="color" 
                            value={presentationSettings.textColor} 
                            onChange={(e) => handlePresentationSettingChange('textColor', e.target.value)}
                            className="w-full h-12 p-1"
                        />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="font-size" className="text-lg font-semibold flex items-center"><MoveHorizontal className="w-5 h-5 mr-2" /> Tamanho & Alinhamento</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="font-size"
                        min={24}
                        max={120}
                        step={2}
                        value={[presentationSettings.fontSize]}
                        onValueChange={([value]) => handlePresentationSettingChange('fontSize', value)}
                      />
                      <span className="font-bold w-16 text-center text-xl">{presentationSettings.fontSize}px</span>
                    </div>
                    <Select
                      value={presentationSettings.textAlign}
                      onValueChange={(value) => handlePresentationSettingChange('textAlign', value)}
                    >
                      <SelectTrigger id="text-align">
                        <SelectValue placeholder="Alinhamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Esquerda</SelectItem>
                        <SelectItem value="center">Centralizado</SelectItem>
                        <SelectItem value="right">Direita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="transition-type" className="text-lg font-semibold flex items-center"><Film className="w-5 h-5 mr-2" /> Transição</Label>
                    <Select
                      value={presentationSettings.transitionType}
                      onValueChange={(value) => handlePresentationSettingChange('transitionType', value)}
                    >
                      <SelectTrigger id="transition-type">
                        <SelectValue placeholder="Tipo de Transição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fade">Esmaecer (Fade)</SelectItem>
                        <SelectItem value="slide">Deslizar (Slide)</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="idle-screen">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><MonitorPlay className="w-6 h-6 mr-3 text-green-500" />Tela de Espera</CardTitle>
                <CardDescription>Configure o que é exibido quando nenhum conteúdo está em apresentação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold">Modo de Espera</Label>
                  <Select
                    value={presentationSettings.idleScreen.type}
                    onValueChange={(value) => handleIdleScreenChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modo de espera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logo"><Tv2 className="w-4 h-4 mr-2" />Logo Padrão</SelectItem>
                      <SelectItem value="image"><ImageIcon className="w-4 h-4 mr-2" />Imagem de Fundo</SelectItem>
                      <SelectItem value="video"><MonitorPlay className="w-4 h-4 mr-2" />Vídeo de Fundo (YouTube)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {presentationSettings.idleScreen.type === 'image' && (
                  <div className="space-y-4">
                    <Label className="font-medium">Escolha uma Imagem para a Tela de Espera</Label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {media.map(image => (
                            <button key={image.id} onClick={() => handleIdleScreenChange('backgroundUrl', image.url)} className={cn("h-20 w-full rounded-lg border-2 transition-all bg-cover bg-center", presentationSettings.idleScreen.backgroundUrl === image.url ? 'border-primary ring-2 ring-primary' : 'border-transparent')} style={{backgroundImage: `url(${image.url})`}}>
                              <div className="w-full h-full bg-black/20" />
                            </button>
                        ))}
                      </div>
                  </div>
                )}

                {presentationSettings.idleScreen.type === 'video' && (
                  <div className="space-y-2">
                    <Label htmlFor="video-url">URL do Vídeo do YouTube</Label>
                    <Input
                      id="video-url"
                      placeholder="https://youtu.be/..."
                      value={presentationSettings.idleScreen.videoUrl}
                      onChange={(e) => handleIdleScreenChange('videoUrl', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default SettingsPage;