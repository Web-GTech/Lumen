import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import LumenLogo from '@/components/LumenLogo';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [churchName, setChurchName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signUp } = useAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(email, password);
    if (!error) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta!`,
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signUp(email, password, churchName);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Bem-vindo ao Lumen</title>
        <meta name="description" content="Faça login ou cadastre-se no Lumen para acessar o sistema de apresentação da sua igreja." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <Card className="shadow-2xl border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl">
            <CardHeader className="text-center space-y-4 pt-8">
               <LumenLogo className="w-20 h-20" textClassName="text-3xl" />
              
              <CardDescription className="text-base">
                O futuro da apresentação para sua igreja começa aqui.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Seu E-mail</Label>
                      <Input id="login-email" type="email" placeholder="nome@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 bg-white/50 dark:bg-gray-700/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Sua Senha</Label>
                      <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 bg-white/50 dark:bg-gray-700/50" />
                    </div>
                    <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-base" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Acessar Painel'}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-churchName">Nome da Igreja</Label>
                      <Input id="signup-churchName" type="text" placeholder="Ex: Igreja da Cidade" value={churchName} onChange={(e) => setChurchName(e.target.value)} required className="h-11 bg-white/50 dark:bg-gray-700/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Seu E-mail</Label>
                      <Input id="signup-email" type="email" placeholder="nome@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 bg-white/50 dark:bg-gray-700/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Crie uma Senha</Label>
                      <Input id="signup-password" type="password" placeholder="Pelo menos 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 bg-white/50 dark:bg-gray-700/50" />
                    </div>
                    <Button type="submit" className="w-full h-11 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold text-base" disabled={loading}>
                     {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Começar a Usar'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default LoginPage;