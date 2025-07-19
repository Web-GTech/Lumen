import { useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const useApi = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchAllData, addLog } = useAppState();
  const navigate = useNavigate();

  const addService = useCallback(async () => {
    if (!user) {
      toast({ title: 'Usuário não autenticado.', variant: 'destructive' });
      return;
    }

    const newService = {
      title: `Culto ${new Date().toLocaleDateString('pt-BR')}`,
      service_date: new Date().toISOString(),
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('services')
      .insert(newService)
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao criar novo culto', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Novo culto criado com sucesso!' });
      addLog(`Novo culto "${data.title}" criado.`);
      await fetchAllData();
      navigate(`/service/${data.id}`);
    }
  }, [user, toast, addLog, fetchAllData, navigate]);

  return {
    addService
  };
};