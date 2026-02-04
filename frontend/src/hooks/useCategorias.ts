import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoriasApi } from '../services/api';

// Hook que gerencia todas as operações de categorias
export function useCategorias() {
  const queryClient = useQueryClient();

  const { data: categorias, isLoading, error } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.listar,
  });

  const criarMutation = useMutation({
    mutationFn: categoriasApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-categoria'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao criar categoria';
      toast.error(mensagem);
    },
  });

  return {
    categorias,
    isLoading,
    error,
    criarMutation,
  };
}
