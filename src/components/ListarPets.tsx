import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit, Trash2, Activity, Dog, Cat } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export const ListarPets = () => {
  const navigate = useNavigate();

  // ✅ Agora vem do contexto já usando JSONServer
  const { pets, carregarPets, deletarPet } = useApp();

  useEffect(() => {
    carregarPets();
  }, []);

  const handleDelete = async (id: string, nome: string) => {
    try {
      await deletarPet(Number(id));
      toast.success(`${nome} foi removido com sucesso`);
    } catch {
      toast.error("Erro ao remover pet");
    }
  };

  if (pets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="text-center">
            <h1 className="text-3xl mb-4 text-gray-800">Meus Pets</h1>
            <p className="text-gray-600 mb-8">Você ainda não cadastrou nenhum pet</p>
            <Button
              size="lg"
              onClick={() => navigate('/vincular-pet')}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Adicionar Primeiro Pet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-gray-800">Meus Pets</h1>
          <Button
            onClick={() => navigate('/vincular-pet')}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Adicionar Pet
          </Button>
        </div>

        <div className="grid gap-4">
          {pets.map((pet) => (
            <Card key={pet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {pet.tipo_animal === 'cachorro' ? (
                      <Dog className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Cat className="h-8 w-8 text-purple-500" />
                    )}
                    <div>
                      <CardTitle>{pet.nome}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {pet.raca} • {pet.porte} • {pet.peso}kg
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => navigate(`/editar-pet/${pet.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {pet.nome}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pet.id, pet.nome)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Deletar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={pet.vacinas ? 'default' : 'secondary'}>
                    {pet.vacinas ? '✓' : '✗'} Vacinado
                  </Badge>
                  <Badge variant={pet.vermifugado ? 'default' : 'secondary'}>
                    {pet.vermifugado ? '✓' : '✗'} Vermifugado
                  </Badge>
                  <Badge variant={pet.castrado ? 'default' : 'secondary'}>
                    {pet.castrado ? '✓' : '✗'} Castrado
                  </Badge>
                  <Badge variant="outline">{pet.sexo}</Badge>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => navigate(`/monitorar-pet/${pet.id}`)}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Monitorar Pet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
