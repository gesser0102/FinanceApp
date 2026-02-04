import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Plus, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoriasApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { FormField, FormInput, FormSelect } from '../components/ui/Form';
import { CardSkeleton } from '../components/ui/Skeleton';
import { categoriaSchema, type CategoriaFormData } from '../lib/validations';
import { FinalidadeCategoria } from '../types';

export const Categorias = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      descricao: '',
      finalidade: FinalidadeCategoria.Ambas,
    },
  });

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.listar,
  });

  const criarMutation = useMutation({
    mutationFn: categoriasApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-categoria'] });
      toast.success('Categoria criada com sucesso!');
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao criar categoria';
      toast.error(mensagem);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    criarMutation.mutate(data);
  });

  const finalidadeOptions = [
    { value: FinalidadeCategoria.Despesa, label: 'Despesa' },
    { value: FinalidadeCategoria.Receita, label: 'Receita' },
    { value: FinalidadeCategoria.Ambas, label: 'Ambas' },
  ];

  const getFinalidadeBadge = (finalidade: number) => {
    const classes: Record<number, string> = {
      [FinalidadeCategoria.Despesa]: 'bg-danger-900/30 text-red-800',
      [FinalidadeCategoria.Receita]: 'bg-success-900/30 text-green-800',
      [FinalidadeCategoria.Ambas]: 'bg-primary-900/30 text-dark-50',
    };
    const labels: Record<number, string> = {
      [FinalidadeCategoria.Despesa]: 'Despesa',
      [FinalidadeCategoria.Receita]: 'Receita',
      [FinalidadeCategoria.Ambas]: 'Ambas',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[finalidade]}`}>
        {labels[finalidade]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-dark-50">Categorias</h1>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias?.map((categoria) => (
            <Card key={categoria.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent-900/30 rounded-full flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-accent-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-dark-50 mb-1">
                    {categoria.descricao}
                  </h3>
                  {getFinalidadeBadge(categoria.finalidade)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {categorias?.length === 0 && (
        <Card className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-50 mb-2">
            Nenhuma categoria cadastrada
          </h3>
          <p className="text-dark-300 mb-6">
            Crie categorias para organizar suas transações
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Primeira Categoria
          </Button>
        </Card>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) form.reset();
        }}
        title="Nova Categoria"
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField name="descricao" label="Descrição">
              <FormInput name="descricao" placeholder="Ex: Alimentação, Salário..." required />
            </FormField>

            <FormField name="finalidade" label="Finalidade">
              <FormSelect name="finalidade" options={finalidadeOptions} required />
            </FormField>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 text-sm text-yellow-300">
              <p className="font-medium mb-1">⚠️ Atenção:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Despesa: apenas para transações de despesa</li>
                <li>Receita: apenas para transações de receita</li>
                <li>Ambas: pode ser usada em qualquer tipo</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setDialogOpen(false);
                  form.reset();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={criarMutation.isPending}
              >
                {criarMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
};
