import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { transacoesApi } from '../services/api';

// Hook que gerencia todas as operações de transações
export function useTransacoes() {
  const queryClient = useQueryClient();

  const { data: transacoes, isLoading, error } = useQuery({
    queryKey: ['transacoes'],
    queryFn: transacoesApi.listar,
  });

  const criarMutation = useMutation({
    mutationFn: transacoesApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-pessoa'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-categoria'] });
      toast.success('Transação criada com sucesso!');
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao criar transação';
      toast.error(mensagem);
    },
  });

  return {
    transacoes,
    isLoading,
    error,
    criarMutation,
  };
}
