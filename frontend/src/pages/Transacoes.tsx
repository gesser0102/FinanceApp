import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Receipt, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { transacoesApi, pessoasApi, categoriasApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { FormField, FormInput, FormSelect } from '../components/ui/Form';
import { CardSkeleton } from '../components/ui/Skeleton';
import { transacaoSchema, type TransacaoFormData } from '../lib/validations';
import { TipoTransacao } from '../types';

export const Transacoes = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 'receitas' | 'despesas'>('todas');

  const queryClient = useQueryClient();

  const form = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      descricao: '',
      valor: 0,
      tipo: TipoTransacao.Despesa,
      categoriaId: 0,
      pessoaId: 0,
    },
  });

  const { data: transacoes, isLoading } = useQuery({
    queryKey: ['transacoes'],
    queryFn: transacoesApi.listar,
  });

  const { data: pessoas } = useQuery({
    queryKey: ['pessoas'],
    queryFn: pessoasApi.listar,
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.listar,
  });

  const criarMutation = useMutation({
    mutationFn: transacoesApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-pessoa'] });
      queryClient.invalidateQueries({ queryKey: ['totais-por-categoria'] });
      toast.success('Transação criada com sucesso!');
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      const mensagem = error.response?.data?.mensagem || 'Erro ao criar transação';
      toast.error(mensagem);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    criarMutation.mutate(data);
  });

  const pessoaOptions = pessoas?.map((p) => ({ value: p.id, label: p.nome })) ?? [];
  const categoriaOptions = categorias?.map((c) => ({ value: c.id, label: c.descricao })) ?? [];
  const tipoOptions = [
    { value: TipoTransacao.Despesa, label: 'Despesa' },
    { value: TipoTransacao.Receita, label: 'Receita' },
  ];

  const transacoesFiltradas = transacoes?.filter((t) => {
    if (filtroTipo === 'receitas') return t.tipo === TipoTransacao.Receita;
    if (filtroTipo === 'despesas') return t.tipo === TipoTransacao.Despesa;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-dark-50">Transações</h1>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Nova Transação
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filtroTipo === 'todas' ? 'primary' : 'secondary'}
          onClick={() => setFiltroTipo('todas')}
        >
          Todas
        </Button>
        <Button
          variant={filtroTipo === 'receitas' ? 'primary' : 'secondary'}
          onClick={() => setFiltroTipo('receitas')}
        >
          Receitas
        </Button>
        <Button
          variant={filtroTipo === 'despesas' ? 'primary' : 'secondary'}
          onClick={() => setFiltroTipo('despesas')}
        >
          Despesas
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {transacoesFiltradas?.map((transacao) => (
            <Card key={transacao.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      transacao.tipo === TipoTransacao.Receita
                        ? 'bg-success-900/30'
                        : 'bg-danger-900/30'
                    }`}
                  >
                    {transacao.tipo === TipoTransacao.Receita ? (
                      <ArrowUpCircle className="h-6 w-6 text-success-500" />
                    ) : (
                      <ArrowDownCircle className="h-6 w-6 text-danger-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-50">
                      {transacao.descricao}
                    </h3>
                    <div className="flex gap-3 text-sm text-dark-300">
                      <span>{transacao.pessoaNome}</span>
                      <span>•</span>
                      <span>{transacao.categoriaNome}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xl font-bold ${
                      transacao.tipo === TipoTransacao.Receita
                        ? 'text-success-500'
                        : 'text-danger-500'
                    }`}
                  >
                    {transacao.tipo === TipoTransacao.Receita ? '+' : '-'}
                    {' R$ '}
                    {transacao.valor.toFixed(2)}
                  </div>
                  <div className="text-sm text-dark-400">{transacao.tipoTexto}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {transacoesFiltradas?.length === 0 && (
        <Card className="text-center py-12">
          <Receipt className="h-16 w-16 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-50 mb-2">
            Nenhuma transação encontrada
          </h3>
          <p className="text-dark-300 mb-6">
            Comece criando sua primeira transação
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Transação
          </Button>
        </Card>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) form.reset();
        }}
        title="Nova Transação"
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField name="descricao" label="Descrição">
              <FormInput name="descricao" placeholder="Ex: Compra no mercado" required />
            </FormField>

            <FormField name="valor" label="Valor">
              <FormInput
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </FormField>

            <FormField name="tipo" label="Tipo">
              <FormSelect name="tipo" options={tipoOptions} required />
            </FormField>

            <FormField name="pessoaId" label="Pessoa">
              <FormSelect name="pessoaId" options={pessoaOptions} required />
            </FormField>

            <FormField name="categoriaId" label="Categoria">
              <FormSelect name="categoriaId" options={categoriaOptions} required />
            </FormField>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 text-sm text-yellow-300">
              <p className="font-medium mb-1">⚠️ Atenção:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Menores de 18 anos só podem criar despesas</li>
                <li>A categoria deve permitir o tipo de transação selecionado</li>
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
