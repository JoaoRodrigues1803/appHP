import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error('Preencha todos os campos');
      return;
    }

    const sucesso = login(email, senha);
    if (sucesso) {
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } else {
      toast.error('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Fazer Login</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Entrar
            </Button>
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/cadastrar')}
              >
                Não tem conta? Cadastre-se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
