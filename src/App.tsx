import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { CadastrarUsuario } from './components/CadastrarUsuario';
import { VincularPet } from './components/VincularPet';
import { ListarPets } from './components/ListarPets';
import { EditarPet } from './components/EditarPet';
import { MonitorarPet } from './components/MonitorarPet';
import { PerfilUsuario } from './components/PerfilUsuario';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastrar" element={<CadastrarUsuario />} />
            <Route path="/vincular-pet" element={<VincularPet />} />
            <Route path="/listar-pets" element={<ListarPets />} />
            <Route path="/editar-pet/:id" element={<EditarPet />} />
            <Route path="/monitorar-pet/:id" element={<MonitorarPet />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}
