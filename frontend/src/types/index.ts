// Tipos que refletem os DTOs da API

export const TipoTransacao = {
  Despesa: 0,
  Receita: 1,
} as const;

export type TipoTransacao = typeof TipoTransacao[keyof typeof TipoTransacao];

export const FinalidadeCategoria = {
  Despesa: 0,
  Receita: 1,
  Ambas: 2,
} as const;

export type FinalidadeCategoria = typeof FinalidadeCategoria[keyof typeof FinalidadeCategoria];

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  ehMenorDeIdade: boolean;
}

export interface CriarPessoaRequest {
  nome: string;
  idade: number;
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: FinalidadeCategoria;
  finalidadeTexto: string;
}

export interface CriarCategoriaRequest {
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  tipoTexto: string;
  categoriaId: number;
  categoriaNome: string;
  pessoaId: number;
  pessoaNome: string;
}

export interface CriarTransacaoRequest {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
}

export interface TotaisPorPessoa {
  pessoaId: number;
  nomePessoa: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGerais {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface RelatorioTotaisPorPessoa {
  totaisPorPessoa: TotaisPorPessoa[];
  totaisGerais: TotaisGerais;
}

export interface TotaisPorCategoria {
  categoriaId: number;
  nomeCategoria: string;
  finalidade: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioTotaisPorCategoria {
  totaisPorCategoria: TotaisPorCategoria[];
  totaisGerais: TotaisGerais;
}
