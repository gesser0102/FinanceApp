import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { pessoasApi } from '../services/api';
import type { PessoaFormData } from '../lib/validations';

// Hook que gerencia todas as operações de pessoas (criar, editar, deletar, listar)
export function usePessoas() {
  const queryClient = useQueryClient();

  const { data: pessoas, isLoading, error } = useQuery({
    queryKey: ['pessoas'],
    queryFn: pessoasApi.listar,
  });

  const criarMutation = useMutation({
    mutationFn: pessoasApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-pessoa'] });
      toast.success('Pessoa criada com sucesso!');
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao criar pessoa';
      toast.error(mensagem);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: PessoaFormData }) =>
      pessoasApi.atualizar(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-pessoa'] });
      toast.success('Pessoa atualizada com sucesso!');
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao atualizar pessoa';
      toast.error(mensagem);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: pessoasApi.deletar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-pessoa'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-categoria'] });
      queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      toast.success('Pessoa e suas transações foram deletadas com sucesso!');
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao deletar pessoa';
      toast.error(mensagem);
    },
  });

  return {
    pessoas,
    isLoading,
    error,
    criarMutation,
    atualizarMutation,
    deletarMutation,
  };
}
