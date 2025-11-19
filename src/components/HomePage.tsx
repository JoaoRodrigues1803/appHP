import React from 'react';
import { Heart, Syringe, Apple, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { isLoggedIn } = useApp();
  const navigate = useNavigate();

  const dicas = [
    {
      icone: <Apple className="h-12 w-12 text-green-500" />,
      titulo: 'Cuide da Alimentação',
      descricao: 'Uma dieta balanceada é fundamental para a saúde do seu pet. Consulte um veterinário para escolher a melhor opção.',
      imagem: 'https://images.unsplash.com/photo-1762006496712-30db6d0b5c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBmb29kJTIwbnV0cml0aW9ufGVufDF8fHx8MTc2MzQ2MTYzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icone: <Syringe className="h-12 w-12 text-blue-500" />,
      titulo: 'Importância das Vacinas',
      descricao: 'Manter a carteira de vacinação em dia protege seu pet de diversas doenças graves e é essencial para sua saúde.',
      imagem: 'https://images.unsplash.com/photo-1608422050828-485141c98429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwdmFjY2luZXxlbnwxfHx8fDE3NjM0NjE2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icone: <Activity className="h-12 w-12 text-orange-500" />,
      titulo: 'Exercícios Regulares',
      descricao: 'Atividades físicas são importantes para manter seu pet saudável, feliz e com peso adequado.',
      imagem: 'https://images.unsplash.com/photo-1676729274491-579573327bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBleGVyY2lzZSUyMHJ1bm5pbmd8ZW58MXx8fHwxNzYzNDYxNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icone: <Heart className="h-12 w-12 text-pink-500" />,
      titulo: 'Amor e Carinho',
      descricao: 'Demonstre amor e atenção ao seu pet. O vínculo emocional é tão importante quanto os cuidados físicos.',
      imagem: 'https://images.unsplash.com/photo-1728661631084-5f44797184e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGNhdCUyMHBldHN8ZW58MXx8fHwxNzYzNDQ2NjM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4 text-gray-800">
            Bem-vindo ao PetCare
          </h1>
          <p className="text-xl text-gray-600">
            Cuide do bem-estar do seu melhor amigo
          </p>
          
          {!isLoggedIn && (
            <div className="mt-6 flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Fazer Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/cadastrar')}
              >
                Criar Conta
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {dicas.map((dica, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={dica.imagem}
                  alt={dica.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {dica.icone}
                  <CardTitle>{dica.titulo}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{dica.descricao}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoggedIn && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl mb-6 text-gray-800">Comece Agora</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate('/vincular-pet')}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Adicionar um Pet
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/listar-pets')}
              >
                Ver meus Pets
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
