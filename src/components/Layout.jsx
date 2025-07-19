import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Music, 
  Image as ImageIcon, 
  LogOut, 
  Sun, 
  Moon,
  LayoutDashboard,
  Eye,
  EyeOff,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePresentation } from '@/contexts/PresentationContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useApi } from '@/hooks/useApi';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isPresenting, openPresentationWindow, hideContent, currentDisplay, advanceItem, retreatItem, goToItem } = usePresentation();
  const { addLog } = useAppState();
  const { addService } = useApi();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Bíblia', href: '/bible', icon: BookOpen },
    { name: 'Músicas', href: '/songs', icon: Music },
    { name: 'Mídias', href: '/media', icon: ImageIcon },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const handlePresentationToggle = () => {
    if (isPresenting) {
      hideContent();
      addLog("Apresentação ocultada do telão.");
      toast({
        title: "Apresentação ocultada",
        description: "Conteúdo removido do telão.",
      });
    } else {
      openPresentationWindow();
      addLog("Janela de apresentação aberta.");
      toast({
        title: "Modo apresentação",
        description: "Janela de apresentação aberta em nova aba.",
      });
    }
  };

  const handleAddService = () => {
    addService();
  };

  const renderPreview = () => {
    if (!currentDisplay) return null;

    let items = [];
    let currentIndex = -1;
    let itemType = '';

    if (currentDisplay.type === 'song' && currentDisplay.sections?.length > 1) {
      items = currentDisplay.sections;
      currentIndex = currentDisplay.currentSection;
      itemType = 'song';
    } else if (currentDisplay.type === 'verse' && currentDisplay.verses?.length > 1) {
      items = currentDisplay.verses;
      currentIndex = currentDisplay.currentVerseIndex;
      itemType = 'verse';
    }

    if (items.length === 0) return null;

    return (
      <div className="bg-background/50 backdrop-blur-sm p-2 border-t fixed bottom-[60px] md:bottom-0 left-0 right-0 md:relative md:left-auto md:right-auto z-40">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => goToItem(index)}
                className={`p-2 rounded-md cursor-pointer w-40 h-20 flex flex-col justify-center text-center border transition-colors ${
                  index === currentIndex
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted hover:bg-accent'
                }`}
              >
                <p className="text-xs font-bold truncate text-foreground">
                  {itemType === 'song' ? item.title : item.reference}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {itemType === 'song' ? item.content : item.text}
                </p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  };
  
  const DesktopSidebar = () => (
    <aside className="hidden md:flex w-64 flex-shrink-0 bg-card border-r border-border flex-col">
      <div className="flex items-center justify-center h-16 px-4 border-b border-border">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-bold text-lg">L</span>
          </motion.div>
          <span className="text-xl font-bold text-foreground">Lumen</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border space-y-2">
          <Button onClick={handleAddService} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Culto
          </Button>
          <Button
            variant={isPresenting ? "destructive" : "default"}
            size="sm"
            onClick={handlePresentationToggle}
            className="w-full"
          >
            {isPresenting ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPresenting ? 'Ocultar Tela' : 'Abrir Tela'}
          </Button>

          {currentDisplay && (currentDisplay.type === 'song' || (currentDisplay.type === 'verse' && currentDisplay.verses?.length > 1)) && (
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={retreatItem} className="flex-1">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={advanceItem} className="flex-1">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={toggleTheme} className="flex-1">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} className="flex-1">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.user_metadata?.church_name}</p>
          </div>
        </div>
    </aside>
  );

  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex justify-around items-center z-50">
        {navigation.filter(item => item.name !== 'Configurações').map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-1 rounded-md text-xs transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            {item.name}
          </NavLink>
        ))}
        <Button variant="ghost" size="icon" className="flex flex-col items-center h-auto p-1 rounded-md text-xs text-muted-foreground" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-5 h-5 mb-1" />
          Mais
        </Button>
    </div>
  );

  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed inset-0 bg-background z-50 flex flex-col p-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X />
            </Button>
          </div>
          <div className="flex-grow space-y-4">
             <Button onClick={() => { handleAddService(); setIsMobileMenuOpen(false); }} className="w-full justify-start bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                <PlusCircle className="w-5 h-5 mr-3" />
                Adicionar Culto
              </Button>
              <Button
                variant={isPresenting ? "destructive" : "default"}
                onClick={() => { handlePresentationToggle(); setIsMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                {isPresenting ? <EyeOff className="w-5 h-5 mr-3" /> : <Eye className="w-5 h-5 mr-3" />}
                {isPresenting ? 'Ocultar Tela' : 'Abrir Tela'}
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                  <Settings className="w-5 h-5 mr-3" />
                  Configurações
                </Link>
              </Button>
              <Button variant="outline" onClick={toggleTheme} className="w-full justify-start">
                  {theme === 'light' ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
                  Mudar para tema {theme === 'light' ? 'Escuro' : 'Claro'}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                  <LogOut className="w-5 h-5 mr-3" />
                  Sair
              </Button>
          </div>
           <div className="pt-4 text-center border-t">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.user_metadata?.church_name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-[140px] md:pb-0">
          {children}
        </main>
        {renderPreview()}
      </div>
      <MobileBottomNav />
      <MobileMenu />
    </div>
  );
}

export default Layout;