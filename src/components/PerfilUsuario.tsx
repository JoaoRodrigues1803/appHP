import * as React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { User, Mail, Phone, Calendar } from 'lucide-react';

export const PerfilUsuario: React.FC = () => {
  const { usuario, atualizarUsuario } = useApp();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const [nome, setNome] = useState(usuario?.nome || '');
  const [telefone, setTelefone] = useState(usuario?.telefone || '');
  const [email, setEmail] = useState(usuario?.email || '');

  if (!usuario) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !telefone || !email) {
      toast.error('Preencha todos os campos');
      return;
    }

    atualizarUsuario({
      ...usuario,
      nome,
      telefone,
      email,
    });
    
    toast.success('Perfil atualizado com sucesso!');
    setEditMode(false);
  };

  const handleCancel = () => {
    setNome(usuario.nome);
    setTelefone(usuario.telefone);
    setEmail(usuario.email);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
            <CardDescription>Gerencie suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 98765-4321"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Salvar Alterações
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{usuario.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{usuario.telefone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{usuario.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Cadastro</p>
                    <p className="font-medium">
                      {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setEditMode(true)}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  Editar Perfil
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
