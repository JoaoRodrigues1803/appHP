export interface Pet {
  id: string;
  tipo_animal: 'gato' | 'cachorro';
  nome: string;
  raca: string;
  pelagem: 'Curta' | 'Longa' | 'Média';
  data_nascimento: string;
  porte: 'Pequeno' | 'Médio' | 'Grande';
  peso: number;
  sexo: 'Masculino' | 'Feminino';
  vacinas: boolean;
  vermifugado: boolean;
  castrado: boolean;
  mac?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  dataCadastro: string;
}

export interface MonitoringData {
  batimentoAtual: number;
  localizacao: {
    lat: number;
    lng: number;
  };
  historico: {
    timestamp: string;
    batimento: number;
  }[];
}
