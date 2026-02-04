import axios from 'axios';
import type {
  Pessoa,
  CriarPessoaRequest,
  Categoria,
  CriarCategoriaRequest,
  Transacao,
  CriarTransacaoRequest,
  RelatorioTotaisPorPessoa,
  RelatorioTotaisPorCategoria,
} from '../types';

// Cliente HTTP configurado para se comunicar com a API
const api = axios.create({
  baseURL: 'http://localhost:5140/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funções para gerenciar pessoas
export const pessoasApi = {
  listar: async (): Promise<Pessoa[]> => {
    const { data } = await api.get('/pessoas');
    return data;
  },

  buscarPorId: async (id: number): Promise<Pessoa> => {
    const { data } = await api.get(`/pessoas/${id}`);
    return data;
  },

  criar: async (dados: CriarPessoaRequest): Promise<Pessoa> => {
    const { data } = await api.post('/pessoas', dados);
    return data;
  },

  atualizar: async (id: number, dados: CriarPessoaRequest): Promise<Pessoa> => {
    const { data } = await api.put(`/pessoas/${id}`, dados);
    return data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/pessoas/${id}`);
  },
};

// Funções para gerenciar categorias
export const categoriasApi = {
  listar: async (): Promise<Categoria[]> => {
    const { data } = await api.get('/categorias');
    return data;
  },

  criar: async (dados: CriarCategoriaRequest): Promise<Categoria> => {
    const { data } = await api.post('/categorias', dados);
    return data;
  },
};

// Funções para gerenciar transações
export const transacoesApi = {
  listar: async (): Promise<Transacao[]> => {
    const { data } = await api.get('/transacoes');
    return data;
  },

  criar: async (dados: CriarTransacaoRequest): Promise<Transacao> => {
    const { data } = await api.post('/transacoes', dados);
    return data;
  },
};

// Funções para buscar relatórios
export const relatoriosApi = {
  totaisPorPessoa: async (): Promise<RelatorioTotaisPorPessoa> => {
    const { data } = await api.get('/relatorios/totais-por-pessoa');
    return data;
  },

  totaisPorCategoria: async (): Promise<RelatorioTotaisPorCategoria> => {
    const { data } = await api.get('/relatorios/totais-por-categoria');
    return data;
  },
};

export default api;
