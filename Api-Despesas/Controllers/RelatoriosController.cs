using Microsoft.AspNetCore.Mvc;
using Api_Despesas.Services;
using Api_Despesas.DTOs;

namespace Api_Despesas.Controllers;

/// <summary>
/// Gera relatórios financeiros com totalizadores.
/// Permite consultar totais por pessoa e por categoria.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly TransacaoService _transacaoService;

    public RelatoriosController(TransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    /// <summary>
    /// Gera relatório com totais financeiros de cada pessoa.
    /// Exibe receitas, despesas e saldo individual, além dos totais gerais.
    /// </summary>
    /// <returns>
    /// Relatório completo com:
    /// - Lista de pessoas com seus totais individuais
    /// - Totais gerais somando todas as pessoas
    /// </returns>
    [HttpGet("totais-por-pessoa")]
    [ProducesResponseType(typeof(RelatorioTotaisPorPessoaResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<RelatorioTotaisPorPessoaResponse>> ObterTotaisPorPessoa()
    {
        var relatorio = await _transacaoService.ObterTotaisPorPessoaAsync();
        return Ok(relatorio);
    }

    /// <summary>
    /// Gera relatório com totais financeiros de cada categoria.
    /// Exibe receitas, despesas e saldo por categoria, além dos totais gerais.
    /// </summary>
    /// <returns>
    /// Relatório completo com:
    /// - Lista de categorias com seus totais individuais
    /// - Totais gerais somando todas as categorias
    /// </returns>
    [HttpGet("totais-por-categoria")]
    [ProducesResponseType(typeof(RelatorioTotaisPorCategoriaResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<RelatorioTotaisPorCategoriaResponse>> ObterTotaisPorCategoria()
    {
        var relatorio = await _transacaoService.ObterTotaisPorCategoriaAsync();
        return Ok(relatorio);
    }
}
