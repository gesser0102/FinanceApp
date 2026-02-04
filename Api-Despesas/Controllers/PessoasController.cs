using Microsoft.AspNetCore.Mvc;
using Api_Despesas.Services;
using Api_Despesas.DTOs;

namespace Api_Despesas.Controllers;

/// <summary>
/// Gerencia o cadastro de pessoas no sistema.
/// Permite criar, editar, deletar e listar pessoas.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly PessoaService _pessoaService;

    public PessoasController(PessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas.
    /// </summary>
    /// <returns>Lista com todas as pessoas</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<PessoaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<PessoaResponse>>> ListarTodas()
    {
        var pessoas = await _pessoaService.ListarTodasAsync();
        return Ok(pessoas);
    }

    /// <summary>
    /// Busca uma pessoa específica pelo ID.
    /// </summary>
    /// <param name="id">ID da pessoa</param>
    /// <returns>Dados da pessoa</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PessoaResponse>> ObterPorId(int id)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id);

        if (pessoa == null)
        {
            return NotFound(new { mensagem = "Pessoa não encontrada." });
        }

        return Ok(pessoa);
    }

    /// <summary>
    /// Cria uma nova pessoa no sistema.
    /// </summary>
    /// <param name="request">Dados da pessoa (nome e idade)</param>
    /// <returns>Dados da pessoa criada com o ID gerado</returns>
    [HttpPost]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PessoaResponse>> Criar([FromBody] CriarPessoaRequest request)
    {
        // As validações dos atributos (Required, StringLength, etc) são feitas automaticamente
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var pessoa = await _pessoaService.CriarAsync(request);
            // Retorna 201 Created com a localização do novo recurso
            return CreatedAtAction(nameof(ObterPorId), new { id = pessoa.Id }, pessoa);
        }
        catch (InvalidOperationException ex)
        {
            // Erros de regra de negócio
            return BadRequest(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            // Log de erro (em produção, usar ILogger)
            Console.WriteLine($"Erro ao criar pessoa: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { mensagem = "Ocorreu um erro interno ao processar a requisição" });
        }
    }

    /// <summary>
    /// Atualiza os dados de uma pessoa existente.
    /// </summary>
    /// <param name="id">ID da pessoa a ser atualizada</param>
    /// <param name="request">Novos dados da pessoa</param>
    /// <returns>Dados atualizados da pessoa</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PessoaResponse>> Atualizar(int id, [FromBody] CriarPessoaRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var pessoa = await _pessoaService.AtualizarAsync(id, request);

            if (pessoa == null)
            {
                return NotFound(new { mensagem = "Pessoa não encontrada." });
            }

            return Ok(pessoa);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao atualizar pessoa: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { mensagem = "Ocorreu um erro interno ao processar a requisição" });
        }
    }

    /// <summary>
    /// Remove uma pessoa do sistema.
    /// IMPORTANTE: Todas as transações desta pessoa também serão deletadas.
    /// </summary>
    /// <param name="id">ID da pessoa a ser removida</param>
    /// <returns>Confirmação da exclusão</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Deletar(int id)
    {
        var resultado = await _pessoaService.DeletarAsync(id);

        if (!resultado)
        {
            return NotFound(new { mensagem = "Pessoa não encontrada." });
        }

        return Ok(new
        {
            mensagem = "Pessoa deletada com sucesso.",
            aviso = "Todas as transações desta pessoa também foram removidas."
        });
    }
}
