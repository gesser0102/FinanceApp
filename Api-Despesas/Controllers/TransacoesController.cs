using Microsoft.AspNetCore.Mvc;
using Api_Despesas.Services;
using Api_Despesas.DTOs;

namespace Api_Despesas.Controllers;

/// <summary>
/// Gerencia as transações financeiras (receitas e despesas) no sistema.
/// Permite criar e listar transações.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly TransacaoService _transacaoService;

    public TransacoesController(TransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    /// <summary>
    /// Lista todas as transações cadastradas.
    /// </summary>
    /// <returns>Lista com todas as transações</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<TransacaoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TransacaoResponse>>> ListarTodas()
    {
        var transacoes = await _transacaoService.ListarTodasAsync();
        return Ok(transacoes);
    }

    /// <summary>
    /// Cria uma nova transação no sistema.
    /// </summary>
    /// <param name="request">Dados da transação</param>
    /// <returns>Dados da transação criada com o ID gerado</returns>
    /// <remarks>
    /// Tipo de Transação:
    /// - 0 = Despesa (saída de dinheiro)
    /// - 1 = Receita (entrada de dinheiro)
    ///
    /// Validações aplicadas:
    /// - A pessoa e categoria informadas devem existir
    /// - Menores de 18 anos só podem criar despesas
    /// - A categoria deve permitir o tipo de transação (ex: categoria de "Despesa" não aceita transação de "Receita")
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TransacaoResponse>> Criar([FromBody] CriarTransacaoRequest request)
    {
        // Validações básicas dos atributos
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // Validações de negócio (pessoa existe, categoria compatível, menor de idade, etc)
            var (sucesso, erro, transacao) = await _transacaoService.CriarAsync(request);

            if (!sucesso)
            {
                // Retorna 400 Bad Request com a mensagem de erro específica
                return BadRequest(new { mensagem = erro });
            }

            return CreatedAtAction(nameof(ListarTodas), null, transacao);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao criar transação: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { mensagem = "Ocorreu um erro interno ao processar a requisição" });
        }
    }
}
