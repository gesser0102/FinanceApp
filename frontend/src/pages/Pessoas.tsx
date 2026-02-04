import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Plus, Edit, Trash2, UserCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FormField, FormInput } from '../components/ui/Form';
import { CardSkeleton } from '../components/ui/Skeleton';
import { pessoaSchema, type PessoaFormData } from '../lib/validations';
import { usePessoas } from '../hooks/usePessoas';
import { useDisclosure } from '../hooks/useDisclosure';
import type { Pessoa } from '../types';

export const Pessoas = () => {
  const dialog = useDisclosure();
  const confirmDialog = useDisclosure();
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  const [deletingPessoaId, setDeletingPessoaId] = useState<number | null>(null);

  const { pessoas, isLoading, criarMutation, atualizarMutation, deletarMutation } = usePessoas();

  const form = useForm<PessoaFormData>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: {
      nome: '',
      idade: 0,
    },
  });

  const handleOpenDialog = (pessoa?: Pessoa) => {
    if (pessoa) {
      setEditingPessoa(pessoa);
      form.reset({ nome: pessoa.nome, idade: pessoa.idade });
    } else {
      setEditingPessoa(null);
      form.reset({ nome: '', idade: 0 });
    }
    dialog.onOpen();
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (editingPessoa) {
      atualizarMutation.mutate({ id: editingPessoa.id, dados: data }, {
        onSuccess: () => {
          dialog.onClose();
          setEditingPessoa(null);
          form.reset();
        },
      });
    } else {
      criarMutation.mutate(data, {
        onSuccess: () => {
          dialog.onClose();
          form.reset();
        },
      });
    }
  });

  const handleDelete = (id: number) => {
    setDeletingPessoaId(id);
    confirmDialog.onOpen();
  };

  const confirmDelete = () => {
    if (deletingPessoaId) {
      deletarMutation.mutate(deletingPessoaId);
      setDeletingPessoaId(null);
      confirmDialog.onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-dark-50">Pessoas</h1>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-5 w-5 mr-2" />
          Nova Pessoa
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
          {pessoas?.map((pessoa) => (
            <Card key={pessoa.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-900/50">
                    <span className="text-lg font-bold text-white">
                      {pessoa.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-dark-50 truncate">
                    {pessoa.nome}
                  </h3>
                  <p className="text-sm text-dark-300">
                    {pessoa.idade} anos
                    {pessoa.ehMenorDeIdade && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-900/30 text-yellow-300 text-xs rounded-full">
                        Menor
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleOpenDialog(pessoa)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(pessoa.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Deletar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pessoas?.length === 0 && (
        <Card className="text-center py-12">
          <UserCircle className="h-16 w-16 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-50 mb-2">
            Nenhuma pessoa cadastrada
          </h3>
          <p className="text-dark-300 mb-6">
            Comece adicionando uma nova pessoa ao sistema
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Primeira Pessoa
          </Button>
        </Card>
      )}

      <Dialog
        open={dialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            dialog.onClose();
            setEditingPessoa(null);
            form.reset();
          } else {
            dialog.onOpen();
          }
        }}
        title={editingPessoa ? 'Editar Pessoa' : 'Nova Pessoa'}
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField name="nome" label="Nome">
              <FormInput name="nome" placeholder="Digite o nome" required />
            </FormField>

            <FormField name="idade" label="Idade">
              <FormInput name="idade" type="number" min="0" placeholder="Digite a idade" required />
            </FormField>

            <div className="bg-primary-900/20 border border-blue-200 rounded-lg p-4 text-sm text-dark-50">
              <p className="font-medium mb-1">💡 Importante:</p>
              <p>Menores de 18 anos só podem criar transações de despesa.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  dialog.onClose();
                  setEditingPessoa(null);
                  form.reset();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={criarMutation.isPending || atualizarMutation.isPending}
              >
                {criarMutation.isPending || atualizarMutation.isPending
                  ? 'Salvando...'
                  : editingPessoa
                  ? 'Atualizar'
                  : 'Criar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => open ? confirmDialog.onOpen() : confirmDialog.onClose()}
        title="Deletar Pessoa"
        description={
          <>
            Tem certeza que deseja deletar esta pessoa?
            <br />
            <strong className="text-danger-400">Todas as transações vinculadas também serão deletadas.</strong>
          </>
        }
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </div>
  );
};
