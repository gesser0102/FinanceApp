using Api_Despesas.Data;
using Api_Despesas.Models;
using Api_Despesas.DTOs;

namespace Api_Despesas.Services;

/// <summary>
/// Serviço responsável por gerenciar pessoas no sistema.
/// Contém toda a lógica de negócio e validações relacionadas a pessoas.
/// </summary>
public class PessoaService
{
    private readonly IDataStore<Pessoa> _pessoaStore;
    private readonly IDataStore<Transacao> _transacaoStore;

    public PessoaService(IDataStore<Pessoa> pessoaStore, IDataStore<Transacao> transacaoStore)
    {
        _pessoaStore = pessoaStore;
        _transacaoStore = transacaoStore;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas no sistema.
    /// </summary>
    public async Task<List<PessoaResponse>> ListarTodasAsync()
    {
        var pessoas = await _pessoaStore.ObterTodosAsync();

        return pessoas.Select(p => new PessoaResponse
        {
            Id = p.Id,
            Nome = p.Nome,
            Idade = p.Idade,
            EMenorDeIdade = p.EMenorDeIdade()
        }).ToList();
    }

    /// <summary>
    /// Busca uma pessoa específica pelo ID.
    /// </summary>
    /// <returns>Dados da pessoa ou null se não encontrada</returns>
    public async Task<PessoaResponse?> ObterPorIdAsync(int id)
    {
        var pessoa = await _pessoaStore.ObterPorIdAsync(id);

        if (pessoa == null)
            return null;

        return new PessoaResponse
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade,
            EMenorDeIdade = pessoa.EMenorDeIdade()
        };
    }

    /// <summary>
    /// Cria uma nova pessoa no sistema.
    /// Gera automaticamente um ID único auto-incremental para a pessoa.
    /// </summary>
    public async Task<PessoaResponse> CriarAsync(CriarPessoaRequest request)
    {
        var pessoa = new Pessoa
        {
            // EF Core auto-gera o ID
            Nome = request.Nome.Trim(),
            Idade = request.Idade
        };

        await _pessoaStore.AdicionarAsync(pessoa);
        await _pessoaStore.SalvarAsync();

        return new PessoaResponse
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade,
            EMenorDeIdade = pessoa.EMenorDeIdade()
        };
    }

    /// <summary>
    /// Atualiza os dados de uma pessoa existente.
    /// </summary>
    /// <returns>Dados atualizados ou null se a pessoa não for encontrada</returns>
    public async Task<PessoaResponse?> AtualizarAsync(int id, CriarPessoaRequest request)
    {
        var pessoaExistente = await _pessoaStore.ObterPorIdAsync(id);

        if (pessoaExistente == null)
            return null;

        // Atualiza os dados mantendo o mesmo ID
        pessoaExistente.Nome = request.Nome.Trim();
        pessoaExistente.Idade = request.Idade;

        await _pessoaStore.AtualizarAsync(pessoaExistente);
        await _pessoaStore.SalvarAsync();

        return new PessoaResponse
        {
            Id = pessoaExistente.Id,
            Nome = pessoaExistente.Nome,
            Idade = pessoaExistente.Idade,
            EMenorDeIdade = pessoaExistente.EMenorDeIdade()
        };
    }

    /// <summary>
    /// Remove uma pessoa do sistema.
    /// IMPORTANTE: Também remove todas as transações associadas a essa pessoa.
    /// </summary>
    /// <returns>True se a pessoa foi removida, False se não foi encontrada</returns>
    public async Task<bool> DeletarAsync(int id)
    {
        var pessoa = await _pessoaStore.ObterPorIdAsync(id);

        if (pessoa == null)
            return false;

        // Busca todas as transações da pessoa para deletar em cascata
        var todasTransacoes = await _transacaoStore.ObterTodosAsync();
        var transacoesDaPessoa = todasTransacoes.Where(t => t.PessoaId == id).ToList();

        // Remove todas as transações da pessoa
        foreach (var transacao in transacoesDaPessoa)
        {
            await _transacaoStore.RemoverAsync(transacao.Id);
        }

        // Remove a pessoa
        await _pessoaStore.RemoverAsync(id);
        await _pessoaStore.SalvarAsync();

        return true;
    }

    /// <summary>
    /// Verifica se uma pessoa existe no sistema.
    /// Útil para validações em outros serviços.
    /// </summary>
    public async Task<bool> ExisteAsync(int id)
    {
        var pessoa = await _pessoaStore.ObterPorIdAsync(id);
        return pessoa != null;
    }
}
