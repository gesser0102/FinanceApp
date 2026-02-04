import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Wallet, Users, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { relatoriosApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { StatCardSkeleton, TableSkeleton } from '../components/ui/Skeleton';

export const Dashboard = () => {
  const { data: relatorioPessoas, isLoading: isLoadingPessoas } = useQuery({
    queryKey: ['totais-por-pessoa'],
    queryFn: relatoriosApi.totaisPorPessoa,
  });

  const { data: relatorioCategorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ['totais-por-categoria'],
    queryFn: relatoriosApi.totaisPorCategoria,
  });

  const totaisGerais = relatorioPessoas?.totaisGerais;
  const saldoPositivo = (totaisGerais?.saldoLiquido || 0) >= 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-50">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral das suas finanças</p>
      </div>

      {/* Cards com resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingPessoas ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <Card className="hover:shadow-md transition-shadow border-success-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-400">Total Receitas</p>
                  <p className="text-2xl font-bold text-success-400 mt-2">
                    R$ {totaisGerais?.totalReceitas.toFixed(2)}
                  </p>
                </div>
                <div className="bg-success-500/20 p-3 rounded-full ring-2 ring-success-500/30">
                  <TrendingUp className="h-6 w-6 text-success-400" />
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-danger-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-400">Total Despesas</p>
                  <p className="text-2xl font-bold text-danger-400 mt-2">
                    R$ {totaisGerais?.totalDespesas.toFixed(2)}
                  </p>
                </div>
                <div className="bg-danger-500/20 p-3 rounded-full ring-2 ring-danger-500/30">
                  <TrendingDown className="h-6 w-6 text-danger-400" />
                </div>
              </div>
            </Card>

            <Card className={`hover:shadow-md transition-shadow ${saldoPositivo ? 'border-primary-900/30' : 'border-amber-900/30'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-400">Saldo Líquido</p>
                  <p className={`text-2xl font-bold mt-2 ${saldoPositivo ? 'text-primary-400' : 'text-amber-400'}`}>
                    R$ {totaisGerais?.saldoLiquido.toFixed(2)}
                  </p>
                </div>
                <div className={`${saldoPositivo ? 'bg-primary-500/20 ring-2 ring-primary-500/30' : 'bg-amber-500/20 ring-2 ring-amber-500/30'} p-3 rounded-full`}>
                  <Wallet className={`h-6 w-6 ${saldoPositivo ? 'text-primary-400' : 'text-amber-400'}`} />
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-accent-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-400">Pessoas</p>
                  <p className="text-2xl font-bold text-accent-400 mt-2">
                    {relatorioPessoas?.totaisPorPessoa.length || 0}
                  </p>
                </div>
                <div className="bg-accent-500/20 p-3 rounded-full ring-2 ring-accent-500/30">
                  <Users className="h-6 w-6 text-accent-400" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Resumo por pessoa */}
      <Card title="Totais por Pessoa" subtitle="Detalhamento financeiro individual">
        {isLoadingPessoas ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="text-left py-3 px-4 font-semibold text-dark-200">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-200">Idade</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark-200">Receitas</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark-200">Despesas</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark-200">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {relatorioPessoas?.totaisPorPessoa.map((pessoa) => (
                  <tr key={pessoa.pessoaId} className="border-b border-dark-800/50 hover:bg-dark-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-semibold mr-3 shadow-lg shadow-primary-900/50">
                          {pessoa.nomePessoa.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-dark-100 font-medium">{pessoa.nomePessoa}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-dark-400">{pessoa.idade} anos</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center text-success-400 font-medium">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        R$ {pessoa.totalReceitas.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center text-danger-400 font-medium">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        R$ {pessoa.totalDespesas.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${pessoa.saldo >= 0 ? 'text-primary-400' : 'text-amber-400'}`}>
                        R$ {pessoa.saldo.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Resumo por categoria */}
      <Card title="Totais por Categoria" subtitle="Detalhamento financeiro por categoria">
        {isLoadingCategorias ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="text-left py-3 px-4 font-semibold text-dark-200">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-200">Finalidade</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark-200">Receitas</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark-200">Despesas</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark-200">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {relatorioCategorias?.totaisPorCategoria.map((categoria) => (
                  <tr key={categoria.categoriaId} className="border-b border-dark-800/50 hover:bg-dark-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-accent-400 mr-2" />
                        <span className="text-dark-100 font-medium">{categoria.nomeCategoria}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-dark-800 text-dark-300 border border-dark-700">
                        {categoria.finalidade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-success-400 font-medium">
                      R$ {categoria.totalReceitas.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-danger-400 font-medium">
                      R$ {categoria.totalDespesas.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${categoria.saldo >= 0 ? 'text-primary-400' : 'text-amber-400'}`}>
                        R$ {categoria.saldo.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
