import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Pet } from '../types';

export const VincularPet: React.FC = () => {
  const [tipo, setTipo] = useState<'gato' | 'cachorro'>('cachorro');
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [pelagem, setPelagem] = useState<'Curta' | 'Longa' | 'Média'>('Curta');
  const [dataNascimento, setDataNascimento] = useState('');
  const [porte, setPorte] = useState<'Pequeno' | 'Médio' | 'Grande'>('Médio');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState<'Masculino' | 'Feminino'>('Masculino');
  const [vacinado, setVacinado] = useState('sim');
  const [vermifugado, setVermifugado] = useState('sim');
  const [castrado, setCastrado] = useState('sim');
  const [mac, setMac] = useState('');

  const { adicionarPet } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !raca || !dataNascimento || !peso) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const novoPet: Omit<Pet, 'id'> = {
      tipo,
      nome,
      raca,
      pelagem,
      dataNascimento,
      porte,
      peso: parseFloat(peso),
      sexo,
      vacinado: vacinado === 'sim',
      vermifugado: vermifugado === 'sim',
      castrado: castrado === 'sim',
      mac: mac || undefined,
    };

    adicionarPet(novoPet);
    toast.success(`${nome} foi cadastrado com sucesso!`);
    navigate('/listar-pets');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Vincular Pet</CardTitle>
            <CardDescription>Cadastre um novo pet no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Animal *</Label>
                  <Select value={tipo} onValueChange={(v) => setTipo(v as 'gato' | 'cachorro')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cachorro">Cachorro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do pet"
                  />
                </div>

                <div>
                  <Label htmlFor="raca">Raça *</Label>
                  <Input
                    id="raca"
                    value={raca}
                    onChange={(e) => setRaca(e.target.value)}
                    placeholder="Ex: Labrador, Siamês"
                  />
                </div>

                <div>
                  <Label htmlFor="pelagem">Pelagem</Label>
                  <Select value={pelagem} onValueChange={(v) => setPelagem(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Curta">Curta</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Longa">Longa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="porte">Porte</Label>
                  <Select value={porte} onValueChange={(v) => setPorte(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pequeno">Pequeno</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="peso">Peso (kg) *</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="Ex: 25.5"
                  />
                </div>

                <div>
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select value={sexo} onValueChange={(v) => setSexo(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vacinado">Vacinado</Label>
                  <Select value={vacinado} onValueChange={setVacinado}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vermifugado">Vermifugado</Label>
                  <Select value={vermifugado} onValueChange={setVermifugado}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="castrado">Castrado</Label>
                  <Select value={castrado} onValueChange={setCastrado}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mac">MAC (Placa do Chip)</Label>
                  <Input
                    id="mac"
                    value={mac}
                    onChange={(e) => setMac(e.target.value)}
                    placeholder="Número do chip"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-600">
                  Salvar Pet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/listar-pets')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
