import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, Usuario } from '../types';

interface AppContextType {
  usuario: Usuario | null;
  pets: Pet[];
  isLoggedIn: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  cadastrarUsuario: (usuario: Omit<Usuario, 'id' | 'dataCadastro'>) => Promise<boolean>;
  atualizarUsuario: (usuario: Usuario) => Promise<void>;
  carregarPets: (usuarioId?: number) => Promise<void>;
  atualizarPet: (pet: Pet) => Promise<void>;
  deletarPet: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ======================
  // LOGIN
  // ======================
  const login = async (email: string, senha: string): Promise<boolean> => {
    console.log(`http://hpapi.alwaysdata.net/usuarios?email=${email}&senha=${senha}`)
    try {
      const res = await fetch(
        `http://hpapi.alwaysdata.net/usuarios?email=${email}&senha=${senha}`
      );

      const data = await res.json();

      console.log(data)

      if (data.length === 0) return false;

      setUsuario(data[0]);
      setIsLoggedIn(true);
      localStorage.setItem("usuario", JSON.stringify(data[0]));

      return true;

    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    setUsuario(null);
    setIsLoggedIn(false);
    localStorage.removeItem("usuario");
    setPets([]);
  };

  // ======================
  // CADASTRAR USUÁRIO
  // ======================
  const cadastrarUsuario = async (
    novoUsuario: Omit<Usuario, 'id' | 'dataCadastro'>
  ): Promise<boolean> => {
    try {
      const body = {
        ...novoUsuario,
        dataCadastro: new Date().toISOString().split("T")[0],
      };

      const res = await fetch(`http://hpapi.alwaysdata.net/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const criado = await res.json();

      setUsuario(criado);
      setIsLoggedIn(true);
      localStorage.setItem("usuario", JSON.stringify(criado));

      return true;

    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      return false;
    }
  };

  // ======================
  // ATUALIZAR USUÁRIO
  // ======================
  const atualizarUsuario = async (usuarioAtualizado: Usuario) => {
    if (!usuarioAtualizado.id) return;

    await fetch(`http://hpapi.alwaysdata.net/usuarios/${usuarioAtualizado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioAtualizado),
    });

    setUsuario(usuarioAtualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
  };

  // ======================
  // CARREGAR PETS
  // ======================
  const carregarPets = async (usuarioId?: number) => {
    try {
      const id = usuarioId ?? usuario?.id;
      if (!id) return;

      const res = await fetch(`http://hpapi.alwaysdata.net/pets?usuarioId=${id}`);
      const data = await res.json();
      setPets(data);

    } catch (err) {
      console.error("Erro ao carregar pets:", err);
    }
  };

  // ======================
  // ATUALIZAR PET
  // ======================
  const atualizarPet = async (pet: Pet) => {
    await fetch(`http://hpapi.alwaysdata.net/pets/${pet.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pet),
    });

    setPets(prev => prev.map(p => Number(p.id) === Number(pet.id) ? pet : p));
  };

  // ======================
  // DELETAR PET
  // ======================
  const deletarPet = async (id: number) => {
    await fetch(`http://hpapi.alwaysdata.net/pets/${id}`, { method: "DELETE" });
    setPets(prev => prev.filter(p => Number(p.id) !== id));
  };

  // ✅ RESTAURA LOGIN AUTOMATICAMENTE
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      const user = JSON.parse(stored);
      setUsuario(user);
      setIsLoggedIn(true);
    }
  }, []);

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
        carregarPets,
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
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};
