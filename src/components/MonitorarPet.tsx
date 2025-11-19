import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Heart, MapPin, Activity as ActivityIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MonitorarPet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pets } = useApp();
  const navigate = useNavigate();
  const pet = pets.find(p => p.id === id);

  const [batimentoAtual, setBatimentoAtual] = useState(85);
  const [historico, setHistorico] = useState<{ tempo: string; batimento: number }[]>([]);

  useEffect(() => {
    // Gerar dados históricos iniciais
    const horaAtual = new Date();
  const dados: { tempo: string; batimento: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const tempo = new Date(horaAtual.getTime() - i * 5 * 60000);
      dados.push({
        tempo: tempo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        batimento: Math.floor(Math.random() * 20) + 75,
      });
    }
    setHistorico(dados);

    // Simular atualização em tempo real
    const interval = setInterval(() => {
      const novoBatimento = Math.floor(Math.random() * 20) + 75;
      setBatimentoAtual(novoBatimento);
      
      setHistorico(prev => {
        const novoHistorico: { tempo: string; batimento: number }[] = [
          ...prev.slice(1),
          {
            tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            batimento: novoBatimento,
          },
        ];
        return novoHistorico;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Pet não encontrado</p>
            <Button onClick={() => navigate('/listar-pets')} className="mt-4">
              Voltar para lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusBatimento = batimentoAtual >= 60 && batimentoAtual <= 100 ? 'normal' : 'alerta';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/listar-pets')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl text-gray-800 mb-2">Monitorando {pet.nome}</h1>
          <p className="text-gray-600">{pet.raca} • {pet.porte}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Batimentos Cardíacos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl mb-2 text-blue-500 animate-pulse">
                  {batimentoAtual}
                </div>
                <div className="text-gray-600 mb-4">BPM</div>
                <Badge variant={statusBatimento === 'normal' ? 'default' : 'destructive'}>
                  {statusBatimento === 'normal' ? 'Normal' : 'Atenção'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                Localização Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-50"></div>
                <div className="relative text-center z-10">
                  <MapPin className="h-12 w-12 text-green-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-sm text-gray-700">Rua das Flores, 123</p>
                  <p className="text-xs text-gray-500">São Paulo, SP</p>
                  <Badge className="mt-2 bg-green-500">Em Casa</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-purple-500" />
              Histórico de Batimentos (Última Hora)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tempo" />
                  <YAxis domain={[60, 120]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="batimento"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Atualização em tempo real a cada 3 segundos
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
