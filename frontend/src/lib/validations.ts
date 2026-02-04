import { z } from 'zod';
import { TipoTransacao, FinalidadeCategoria } from '../types';

// Schema para Pessoa
export const pessoaSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),
  idade: z
    .number({ message: 'Idade deve ser um número' })
    .int('Idade deve ser um número inteiro')
    .min(0, 'Idade deve ser maior ou igual a 0')
    .max(150, 'Idade deve ser menor que 150'),
});

export type PessoaFormData = z.infer<typeof pessoaSchema>;

// Schema para Categoria
export const categoriaSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(400, 'Descrição deve ter no máximo 400 caracteres')
    .trim(),
  finalidade: z.nativeEnum(FinalidadeCategoria, {
    message: 'Selecione uma finalidade válida',
  }),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;

// Schema para Transação
export const transacaoSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(400, 'Descrição deve ter no máximo 400 caracteres')
    .trim(),
  valor: z
    .number({ message: 'Valor deve ser um número' })
    .positive('Valor deve ser maior que zero')
    .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
  tipo: z.nativeEnum(TipoTransacao, {
    message: 'Selecione um tipo válido',
  }),
  categoriaId: z
    .number({ message: 'Categoria é obrigatória' })
    .int()
    .positive('Selecione uma categoria'),
  pessoaId: z
    .number({ message: 'Pessoa é obrigatória' })
    .int()
    .positive('Selecione uma pessoa'),
});

export type TransacaoFormData = z.infer<typeof transacaoSchema>;
