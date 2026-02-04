using Microsoft.AspNetCore.Mvc;
using Api_Despesas.Services;
using Api_Despesas.DTOs;

namespace Api_Despesas.Controllers;

/// <summary>
/// Gerencia o cadastro de categorias no sistema.
/// Permite criar e listar categorias.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly CategoriaService _categoriaService;

    public CategoriasController(CategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    /// <summary>
    /// Lista todas as categorias cadastradas.
    /// </summary>
    /// <returns>Lista com todas as categorias</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<CategoriaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CategoriaResponse>>> ListarTodas()
    {
        var categorias = await _categoriaService.ListarTodasAsync();
        return Ok(categorias);
    }

    /// <summary>
    /// Cria uma nova categoria no sistema.
    /// </summary>
    /// <param name="request">Dados da categoria (descrição e finalidade)</param>
    /// <returns>Dados da categoria criada com o ID gerado</returns>
    /// <remarks>
    /// Finalidade:
    /// - 0 = Despesa (categoria só para gastos)
    /// - 1 = Receita (categoria só para ganhos)
    /// - 2 = Ambas (categoria para gastos e ganhos)
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(CategoriaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CategoriaResponse>> Criar([FromBody] CriarCategoriaRequest request)
    {
        // As validações dos atributos (Required, StringLength, etc) são feitas automaticamente
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var categoria = await _categoriaService.CriarAsync(request);

        return CreatedAtAction(nameof(ListarTodas), null, categoria);
    }
}
