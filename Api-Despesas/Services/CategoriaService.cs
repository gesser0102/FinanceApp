using Api_Despesas.Data;
using Api_Despesas.Models;
using Api_Despesas.DTOs;

namespace Api_Despesas.Services;

/// <summary>
/// Serviço responsável por gerenciar categorias no sistema.
/// Contém toda a lógica de negócio e validações relacionadas a categorias.
/// </summary>
public class CategoriaService
{
    private readonly IDataStore<Categoria> _categoriaStore;

    public CategoriaService(IDataStore<Categoria> categoriaStore)
    {
        _categoriaStore = categoriaStore;
    }

    /// <summary>
    /// Lista todas as categorias cadastradas no sistema.
    /// </summary>
    public async Task<List<CategoriaResponse>> ListarTodasAsync()
    {
        var categorias = await _categoriaStore.ObterTodosAsync();

        return categorias.Select(c => new CategoriaResponse
        {
            Id = c.Id,
            Descricao = c.Descricao,
            Finalidade = c.Finalidade,
            FinalidadeTexto = ObterTextoFinalidade(c.Finalidade)
        }).ToList();
    }

    /// <summary>
    /// Busca uma categoria específica pelo ID.
    /// </summary>
    /// <returns>Dados da categoria ou null se não encontrada</returns>
    public async Task<CategoriaResponse?> ObterPorIdAsync(int id)
    {
        var categoria = await _categoriaStore.ObterPorIdAsync(id);

        if (categoria == null)
            return null;

        return new CategoriaResponse
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = categoria.Finalidade,
            FinalidadeTexto = ObterTextoFinalidade(categoria.Finalidade)
        };
    }

    /// <summary>
    /// Cria uma nova categoria no sistema.
    /// Gera automaticamente um ID único para a categoria.
    /// </summary>
    public async Task<CategoriaResponse> CriarAsync(CriarCategoriaRequest request)
    {
        var categoria = new Categoria
        {
            // EF Core auto-gera o ID
            Descricao = request.Descricao.Trim(),
            Finalidade = request.Finalidade
        };

        await _categoriaStore.AdicionarAsync(categoria);
        await _categoriaStore.SalvarAsync();

        return new CategoriaResponse
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = categoria.Finalidade,
            FinalidadeTexto = ObterTextoFinalidade(categoria.Finalidade)
        };
    }

    /// <summary>
    /// Verifica se uma categoria existe no sistema.
    /// Útil para validações em outros serviços.
    /// </summary>
    public async Task<bool> ExisteAsync(int id)
    {
        var categoria = await _categoriaStore.ObterPorIdAsync(id);
        return categoria != null;
    }

    /// <summary>
    /// Valida se uma categoria pode ser usada para um determinado tipo de transação.
    /// Por exemplo: categoria de "Despesa" não pode ser usada para transação de "Receita".
    /// </summary>
    /// <returns>True se a categoria permite o tipo, False caso contrário</returns>
    public async Task<bool> ValidarCategoriaParaTipoTransacaoAsync(int categoriaId, TipoTransacao tipoTransacao)
    {
        var categoria = await _categoriaStore.ObterPorIdAsync(categoriaId);

        if (categoria == null)
            return false;

        return categoria.PermiteTipoTransacao(tipoTransacao);
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
