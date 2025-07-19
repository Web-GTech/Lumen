import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BookOpen, Music, Image, Calendar, PlusCircle, Play, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/contexts/AppStateContext';
import { useApi } from '@/hooks/useApi';
import { toast } from '@/components/ui/use-toast';

function Dashboard() {
  const { services, addLog, songs, media, loading, fetchAllData } = useAppState();
  const { createService } = useApi();
  const navigate = useNavigate();

  const stats = [
    { title: 'Cultos Criados', value: services.length, icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { title: 'Músicas Salvas', value: songs.length, icon: Music, color: 'from-green-500 to-green-600' },
    { title: 'Mídias Salvas', value: media.length, icon: Image, color: 'from-purple-500 to-purple-600' },
    { title: 'Versículos Usados', value: 0, icon: BookOpen, color: 'from-orange-500 to-orange-600', note: '(Em breve)' },
  ];

  const handleAddService = async () => {
    const title = `Culto ${new Date().toLocaleDateString('pt-BR')}`;
    const service_date = new Date().toISOString();
    
    const newService = await createService(title, service_date);

    if (newService) {
      addLog(`Novo culto "${newService.title}" criado.`);
      toast({ title: 'Culto criado com sucesso!' });
      await fetchAllData();
      navigate(`/service/${newService.id}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Helmet>
        <title>Dashboard - Lumen</title>
        <meta name="description" content="Painel principal do Lumen com estatísticas e gerenciamento de cultos." />
      </Helmet>

      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu ministério de apresentação.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}><stat.icon className="h-4 w-4 text-white" /></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  {stat.note && <p className="text-xs text-muted-foreground mt-1">{stat.note}</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciador de Cultos</CardTitle>
                  <CardDescription>Planeje e inicie suas apresentações aqui.</CardDescription>
                </div>
                <Button onClick={handleAddService}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Novo Culto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.sort((a, b) => new Date(b.service_date) - new Date(a.service_date)).map(service => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div>
                        <h3 className="font-semibold text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(service.service_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })} - {service.items?.length || 0} itens
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/service/${service.id}`)}>
                        <Play className="w-4 h-4 mr-2" />
                        Abrir
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">Nenhum culto criado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Comece a planejar sua primeira apresentação.</p>
                  <div className="mt-6">
                    <Button onClick={handleAddService}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Criar Primeiro Culto
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

export default Dashboard;