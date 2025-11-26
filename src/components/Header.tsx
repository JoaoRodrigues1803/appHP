import React, { useState } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { isLoggedIn, usuario, logout } = useApp();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setSheetOpen(false);
  };

  // ✅ fallback seguro para inicial do avatar
  const inicial = usuario?.nome
    ? usuario.nome.trim().charAt(0).toUpperCase()
    : "?";

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigate('/')}
                >
                  Início
                </Button>
                {isLoggedIn && (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate('/vincular-pet')}
                    >
                      Vincular Pet
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate('/listar-pets')}
                    >
                      Listar meus Pets
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigate('/perfil')}
                    >
                      Meu Perfil
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <span className="font-semibold text-xl">HealthPet</span>
          </div>
        </div>

        <div>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Avatar className="cursor-pointer" onClick={() => navigate('/perfil')}>
                <AvatarFallback className="bg-white text-blue-500">
                  {usuario?.nome.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              onClick={() => navigate('/cadastrar')}
              className="bg-white text-blue-500 hover:bg-blue-50"
            >
              <User className="h-4 w-4 mr-2" />
              Cadastrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
