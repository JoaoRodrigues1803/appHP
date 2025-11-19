import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pet, Usuario } from '../types';

interface AppContextType {
  usuario: Usuario | null;
  pets: Pet[];
  isLoggedIn: boolean;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  cadastrarUsuario: (usuario: Omit<Usuario, 'id' | 'dataCadastro'>) => void;
  atualizarUsuario: (usuario: Usuario) => void;
  adicionarPet: (pet: Omit<Pet, 'id'>) => void;
  atualizarPet: (pet: Pet) => void;
  deletarPet: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (email: string, senha: string): boolean => {
    // Mock login - aceita qualquer email/senha para demonstração
    const mockUsuario: Usuario = {
      id: '1',
      nome: 'Usuário Demo',
      telefone: '(11) 98765-4321',
      email: email,
      dataCadastro: new Date().toISOString().split('T')[0],
    };
    setUsuario(mockUsuario);
    setIsLoggedIn(true);
    
    // Mock pets para demonstração
    setPets([
      {
        id: '1',
        tipo: 'cachorro',
        nome: 'Rex',
        raca: 'Labrador',
        pelagem: 'Curta',
        dataNascimento: '2020-05-15',
        porte: 'Grande',
        peso: 30,
        sexo: 'Masculino',
        vacinado: true,
        vermifugado: true,
        castrado: true,
        mac: '123456789',
      },
      {
        id: '2',
        tipo: 'gato',
        nome: 'Mimi',
        raca: 'Siamês',
        pelagem: 'Curta',
        dataNascimento: '2021-03-20',
        porte: 'Pequeno',
        peso: 4,
        sexo: 'Feminino',
        vacinado: true,
        vermifugado: false,
        castrado: true,
      },
    ]);
    return true;
  };

  const logout = () => {
    setUsuario(null);
    setIsLoggedIn(false);
    setPets([]);
  };

  const cadastrarUsuario = (novoUsuario: Omit<Usuario, 'id' | 'dataCadastro'>) => {
    const usuario: Usuario = {
      ...novoUsuario,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString().split('T')[0],
    };
    setUsuario(usuario);
    setIsLoggedIn(true);
  };

  const atualizarUsuario = (usuarioAtualizado: Usuario) => {
    setUsuario(usuarioAtualizado);
  };

  const adicionarPet = (novoPet: Omit<Pet, 'id'>) => {
    const pet: Pet = {
      ...novoPet,
      id: Date.now().toString(),
    };
    setPets([...pets, pet]);
  };

  const atualizarPet = (petAtualizado: Pet) => {
    setPets(pets.map(p => p.id === petAtualizado.id ? petAtualizado : p));
  };

  const deletarPet = (id: string) => {
    setPets(pets.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        usuario,
        pets,
        isLoggedIn,
        login,
        logout,
        cadastrarUsuario,
        atualizarUsuario,
        adicionarPet,
        atualizarPet,
        deletarPet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
