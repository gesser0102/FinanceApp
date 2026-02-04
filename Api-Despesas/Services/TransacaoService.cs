using Api_Despesas.Data;
using Api_Despesas.Models;
using Api_Despesas.DTOs;

namespace Api_Despesas.Services;

/// <summary>
/// Serviço responsável por gerenciar transações financeiras no sistema.
/// Contém toda a lógica de negócio e validações relacionadas a transações.
/// </summary>
public class TransacaoService
{
    private readonly IDataStore<Transacao> _transacaoStore;
    private readonly IDataStore<Pessoa> _pessoaStore;
    private readonly IDataStore<Categoria> _categoriaStore;

    public TransacaoService(
        IDataStore<Transacao> transacaoStore,
        IDataStore<Pessoa> pessoaStore,
        IDataStore<Categoria> categoriaStore)
    {
        _transacaoStore = transacaoStore;
        _pessoaStore = pessoaStore;
        _categoriaStore = categoriaStore;
    }

    /// <summary>
    /// Lista todas as transações cadastradas no sistema.
    /// Inclui informações da pessoa e categoria associadas.
    /// </summary>
    public async Task<List<TransacaoResponse>> ListarTodasAsync()
    {
        var transacoes = await _transacaoStore.ObterTodosAsync();
        var pessoas = await _pessoaStore.ObterTodosAsync();
        var categorias = await _categoriaStore.ObterTodosAsync();

        return transacoes.Select(t => CriarResponse(t, pessoas, categorias)).ToList();
    }

    /// <summary>
    /// Busca uma transação específica pelo ID.
    /// </summary>
    public async Task<TransacaoResponse?> ObterPorIdAsync(int id)
    {
        var transacao = await _transacaoStore.ObterPorIdAsync(id);

        if (transacao == null)
            return null;

        var pessoas = await _pessoaStore.ObterTodosAsync();
        var categorias = await _categoriaStore.ObterTodosAsync();

        return CriarResponse(transacao, pessoas, categorias);
    }

    /// <summary>
    /// Cria uma nova transação no sistema.
    /// Realiza todas as validações de negócio antes de criar:
    /// 1. Verifica se a pessoa existe
    /// 2. Verifica se a categoria existe
    /// 3. Valida se menor de idade pode fazer o tipo de transação
    /// 4. Valida se a categoria permite o tipo de transação
    /// </summary>
    public async Task<(bool Sucesso, string Erro, TransacaoResponse? Dados)> CriarAsync(CriarTransacaoRequest request)
    {
        // Validação 1: A pessoa existe?
        var pessoa = await _pessoaStore.ObterPorIdAsync(request.PessoaId);
        if (pessoa == null)
        {
            return (false, "Pessoa não encontrada. Verifique se o ID da pessoa está correto.", null);
        }

        // Validação 2: A categoria existe?
        var categoria = await _categoriaStore.ObterPorIdAsync(request.CategoriaId);
        if (categoria == null)
        {
            return (false, "Categoria não encontrada. Verifique se o ID da categoria está correto.", null);
        }

        // Validação 3: Se a pessoa é menor de idade, só pode fazer DESPESAS
        if (pessoa.EMenorDeIdade() && request.Tipo == TipoTransacao.Receita)
        {
            return (false,
                $"A pessoa '{pessoa.Nome}' é menor de idade ({pessoa.Idade} anos) e não pode registrar receitas. Apenas despesas são permitidas.",
                null);
        }

        // Validação 4: A categoria permite este tipo de transação?
        if (!categoria.PermiteTipoTransacao(request.Tipo))
        {
            var tipoTexto = request.Tipo == TipoTransacao.Despesa ? "despesa" : "receita";
            var finalidadeTexto = categoria.Finalidade == FinalidadeCategoria.Despesa ? "despesas" : "receitas";

            return (false,
                $"A categoria '{categoria.Descricao}' é configurada para {finalidadeTexto}, mas você tentou criar uma {tipoTexto}. Use uma categoria compatível.",
                null);
        }

        // Tudo validado! Pode criar a transação
        var transacao = new Transacao
        {
            // EF Core auto-gera o ID
            Descricao = request.Descricao.Trim(),
            Valor = request.Valor,
            Tipo = request.Tipo,
            CategoriaId = request.CategoriaId,
            PessoaId = request.PessoaId
        };

        await _transacaoStore.AdicionarAsync(transacao);
        await _transacaoStore.SalvarAsync();

        var response = new TransacaoResponse
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            TipoTexto = ObterTextoTipo(transacao.Tipo),
            CategoriaId = transacao.CategoriaId,
            CategoriaNome = categoria.Descricao,
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa.Nome
        };

        return (true, string.Empty, response);
    }

    /// <summary>
    /// Gera relatório com totais financeiros de cada pessoa.
    /// Calcula receitas, despesas e saldo individual, além dos totais gerais.
    /// </summary>
    public async Task<RelatorioTotaisPorPessoaResponse> ObterTotaisPorPessoaAsync()
    {
        var pessoas = await _pessoaStore.ObterTodosAsync();
        var transacoes = await _transacaoStore.ObterTodosAsync();

        var totaisPorPessoa = new List<TotaisPorPessoaResponse>();

        // Calcula os totais para cada pessoa
        foreach (var pessoa in pessoas)
        {
            var transacoesDaPessoa = transacoes.Where(t => t.PessoaId == pessoa.Id).ToList();

            var totalReceitas = transacoesDaPessoa
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var totalDespesas = transacoesDaPessoa
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            totaisPorPessoa.Add(new TotaisPorPessoaResponse
            {
                PessoaId = pessoa.Id,
                NomePessoa = pessoa.Nome,
                Idade = pessoa.Idade,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            });
        }

        // Calcula os totais gerais (soma de todas as pessoas)
        var totaisGerais = new TotaisGeraisResponse
        {
            TotalReceitas = totaisPorPessoa.Sum(t => t.TotalReceitas),
            TotalDespesas = totaisPorPessoa.Sum(t => t.TotalDespesas),
            SaldoLiquido = totaisPorPessoa.Sum(t => t.Saldo)
        };

        return new RelatorioTotaisPorPessoaResponse
        {
            TotaisPorPessoa = totaisPorPessoa,
            TotaisGerais = totaisGerais
        };
    }

    /// <summary>
    /// Gera relatório com totais financeiros de cada categoria.
    /// Calcula receitas, despesas e saldo por categoria, além dos totais gerais.
    /// </summary>
    public async Task<RelatorioTotaisPorCategoriaResponse> ObterTotaisPorCategoriaAsync()
    {
        var categorias = await _categoriaStore.ObterTodosAsync();
        var transacoes = await _transacaoStore.ObterTodosAsync();

        var totaisPorCategoria = new List<TotaisPorCategoriaResponse>();

        // Calcula os totais para cada categoria
        foreach (var categoria in categorias)
        {
            var transacoesDaCategoria = transacoes.Where(t => t.CategoriaId == categoria.Id).ToList();

            var totalReceitas = transacoesDaCategoria
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var totalDespesas = transacoesDaCategoria
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            totaisPorCategoria.Add(new TotaisPorCategoriaResponse
            {
                CategoriaId = categoria.Id,
                NomeCategoria = categoria.Descricao,
                Finalidade = ObterTextoFinalidade(categoria.Finalidade),
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            });
        }

        // Calcula os totais gerais (soma de todas as categorias)
        var totaisGerais = new TotaisGeraisResponse
        {
            TotalReceitas = totaisPorCategoria.Sum(t => t.TotalReceitas),
            TotalDespesas = totaisPorCategoria.Sum(t => t.TotalDespesas),
            SaldoLiquido = totaisPorCategoria.Sum(t => t.Saldo)
        };

        return new RelatorioTotaisPorCategoriaResponse
        {
            TotaisPorCategoria = totaisPorCategoria,
            TotaisGerais = totaisGerais
        };
    }

    /// <summary>
    /// Cria um objeto de resposta com todas as informações da transação.
    /// </summary>
    private TransacaoResponse CriarResponse(Transacao transacao, List<Pessoa> pessoas, List<Categoria> categorias)
    {
        var pessoa = pessoas.FirstOrDefault(p => p.Id == transacao.PessoaId);
        var categoria = categorias.FirstOrDefault(c => c.Id == transacao.CategoriaId);

        return new TransacaoResponse
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            TipoTexto = ObterTextoTipo(transacao.Tipo),
            CategoriaId = transacao.CategoriaId,
            CategoriaNome = categoria?.Descricao ?? "Categoria não encontrada",
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa?.Nome ?? "Pessoa não encontrada"
        };
    }

    /// <summary>
    /// Converte o enum de tipo de transação para texto legível.
    /// </summary>
    private string ObterTextoTipo(TipoTransacao tipo)
    {
        return tipo == TipoTransacao.Despesa ? "Despesa" : "Receita";
    }

    /// <summary>
    /// Converte o enum de finalidade para texto legível.
    /// </summary>
    private string ObterTextoFinalidade(FinalidadeCategoria finalidade)
    {
        return finalidade switch
        {
            FinalidadeCategoria.Despesa => "Despesa",
            FinalidadeCategoria.Receita => "Receita",
            FinalidadeCategoria.Ambas => "Ambas",
            _ => "Desconhecida"
        };
    }
}
