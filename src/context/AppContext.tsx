import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, Usuario } from '../types';
import supabase from '../db/dbConfig';
import { User } from 'lucide-react';

interface AppContextType {
  usuario: Usuario | null;
  pets: Pet[];
  isLoggedIn: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  cadastrarUsuario: (usuario: Omit<Usuario, 'id' | 'dataCadastro'>) => void;
  atualizarUsuario: (usuario: Usuario) => void;
  atualizarPet: (pet: Pet) => void;
  deletarPet: (id: string) => void;
  carregarPets: (authId?: string) => Promise<void>;
  carregarDadosSensor: (macPlaca: string) => Promise<{
    frequencia: any;
    latitude: any;
    longitude: any;
  } | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   // ====== carregarPets =================================================
  const carregarPets = async (authId?: string) => {
    try {
      const id = authId ?? usuario?.id;
      if (!id) {
        setPets([]);
        return;
      }

      const { data, error } = await supabase
        .from('pet')            // ajuste aqui se sua tabela tiver outro nome
        .select('*')
        .eq('tutor_auth', id);     // ajuste para 'tutor_id' se preferir filtrar pela FK da tabela usuarios

      if (error) {
        console.error('Erro ao carregar pets:', error);
        setPets([]);
        return;
      }

      setPets(data ?? []);
    } catch (err) {
      console.error('Erro inesperado ao carregar pets:', err);
      setPets([]);
    }
  };

  // ================================
  // DELETAR PET
  // ================================
 const deletarPet = async (id: string) => {
  const { error } = await supabase.from("pet").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar pet:", error);
    return;
  }

  setPets((prev) => prev.filter((p) => p.id !== id));
};

//atualizar pet ===============================
  const atualizarPet = async (pet: Pet) => {
  const { id, ...dadosAtualizados } = pet;

  const { data, error } = await supabase
    .from("pet")
    .update(dadosAtualizados)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar pet:", error);
    return;
  }

  setPets((prev) =>
    prev.map((p) => (p.id === id ? data : p))
  );
};
    // ============================
  // 🔥 LOGIN REAL usando Supabase
  // ============================
  const login = async (): Promise<boolean> => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      setUsuario(null);
      setIsLoggedIn(false);
      return false;
    }

    // Pegando os dados do user
    const user = data.user;

    // Caso você tenha tabela "usuario" no Supabase
    const { data: perfil } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', user.email)
      .single();

    const usuarioContexto: Usuario = {
      id: user.id,
      nome: perfil?.nome || user.user_metadata?.nome || "",
      telefone: perfil?.telefone || "",
      email: user.email!,
      dataCadastro: perfil?.dataCadastro || new Date().toISOString().split("T")[0],
    };

    setUsuario(usuarioContexto);
    setIsLoggedIn(true);
    return true;
  };

  // ============================
  // 🔥 LOGOUT REAL
  // ============================
  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    // setPets([]);
    setIsLoggedIn(false);
  };

  // ============================
  // 🔥 CADASTRO LOCAL (para contexto)
  // chamado após signUp na página
  // ============================
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

    // ============================
  // 🔥 Persiste login ao recarregar a página
  // ============================
  useEffect(() => {
    login();
  }, []);
  
  //buscar dados sensor 
  const carregarDadosSensor = async (macPlaca: string) => {
  try {
    const { data, error } = await supabase
      .from("dados_sensor")
      .select("valores")
      .eq("mac_placa", macPlaca)
      .order("data", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Erro ao buscar dados do sensor:", error);
      return null;
    }

    if (!data?.valores) return null;

    return {
      frequencia: data.valores.frequencia,
      latitude: data.valores.latitude,
      longitude: data.valores.longitude,
    };

  } catch (err) {
    console.error("Erro inesperado:", err);
    return null;
  }
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
        deletarPet,
        carregarPets,
        atualizarPet,
        carregarDadosSensor,
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
