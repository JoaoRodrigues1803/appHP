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
  const navigate = useNavigate();
  const { pets } = useApp();

  const petId = Number(id);
  const pet = pets.find(p => Number(p.id) === petId);

  const [batimentoAtual, setBatimentoAtual] = useState<number>(0);
  const [localizacao, setLocalizacao] = useState<{ latitude?: number; longitude?: number }>({});
  const [historico, setHistorico] = useState<Array<{ tempo: string; batimento: number }>>([]);
  const [historicoLocalizacao, setHistoricoLocalizacao] = useState<
    Array<{ tempo: string; latitude: number; longitude: number }>
  >([]);
  const [ultimaGravacao, setUltimaGravacao] = useState<number | null>(null);

  // ============================
  // BUSCAR DADOS DO JSON SERVER
  // ============================
  useEffect(() => {
    if (!pet?.mac_placa) return;

    let mounted = true;
    let interval: any;

    const buscarDados = async () => {
      try {
        const res = await fetch(
          `http://hpapi.alwaysdata.net/dados_sensor?mac_placa=${pet.mac_placa}&_sort=data&_order=desc&_limit=1`
        );

        const data = await res.json();
        if (!mounted || !data?.length) return;

        let valores = data[0].valores;

        // JSON seguro
        if (typeof valores === "string") {
          try {
            valores = JSON.parse(valores);
          } catch (err) {
            console.error("Erro ao parsear JSON:", err);
            return;
          }
        }

        // Atualiza batimento
        setBatimentoAtual(valores.frequencia);

        // Atualiza localização
        setLocalizacao({
          latitude: valores.latitude,
          longitude: valores.longitude,
        });

        // Atualiza gráfico (últimos 12)
        setHistorico(prev => [
          ...prev.slice(-11),
          {
            tempo: new Date(data[0].data).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            batimento: valores.frequencia,
          },
        ]);

        // Controle de registro de posição (1 min)
        const agora = Date.now();

        setUltimaGravacao(prevUltima => {
          if (!prevUltima || agora - prevUltima >= 1 * 60 * 1000) {
            const tempo = new Date(data[0].data).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            setHistoricoLocalizacao(prev => [
              {
                tempo,
                latitude: valores.latitude,
                longitude: valores.longitude,
              },
              ...prev.slice(0, 19),
            ]);

            return agora;
          }
          return prevUltima;
        });

      } catch (err) {
        console.error("Erro ao buscar dados do sensor:", err);
      }
    };

    buscarDados();
    interval = setInterval(buscarDados, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [petId]);
  

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

  const statusBatimento = batimentoAtual >= 60 && batimentoAtual <= 100 ? "normal" : "alerta";

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
              <div className="relative text-center z-10">
                <MapPin className="h-12 w-12 text-green-500 mx-auto mb-2 animate-bounce" />
                {localizacao.latitude && localizacao.longitude ? (
                  <>
                    <p className="text-sm text-gray-700">
                      Lat: {localizacao.latitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Lng: {localizacao.longitude.toFixed(6)}
                    </p>

                    <div className="mt-3 w-full h-40 rounded-lg overflow-hidden border">
                      <iframe
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${localizacao.latitude},${localizacao.longitude}&z=16&output=embed`}
                      ></iframe>
                    </div>

                    <Badge className="mt-2 bg-blue-500">Posição Atual</Badge>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Aguardando dados...</p>
                )}
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
              Atualização em tempo real a cada 30 segundos
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Histórico de Posições
            </CardTitle>
          </CardHeader>

          <CardContent>
            {historicoLocalizacao.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma posição registrada ainda...</p>
            ) : (
              <div className="space-y-4">
                {historicoLocalizacao.map((pos, index) => (
                  <div key={index} className="relative pl-6 border-l border-gray-200">
                    {/* Marcador */}
                    <div className="absolute left-[-6px] top-1 w-3 h-3 bg-green-500 rounded-full shadow" />

                    <p className="text-sm font-medium text-gray-800">
                      {pos.tempo}
                    </p>

                    <p className="text-xs text-gray-500">
                      {pos.latitude.toFixed(6)}, {pos.longitude.toFixed(6)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
