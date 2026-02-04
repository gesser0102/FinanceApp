using System.ComponentModel.DataAnnotations;

namespace Api_Despesas.DTOs;

/// <summary>
/// Dados necessários para criar ou atualizar uma pessoa no sistema.
/// </summary>
public class CriarPessoaRequest
{
    /// <summary>
    /// Nome completo da pessoa (obrigatório, máximo 200 caracteres).
    /// </summary>
    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "O nome deve ter entre 1 e 200 caracteres")]
    [RegularExpression(@"^[a-zA-ZÀ-ÿ\s]+$", ErrorMessage = "O nome deve conter apenas letras")]
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Idade da pessoa em anos (obrigatória, deve ser maior ou igual a 0).
    /// </summary>
    [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150 anos")]
    public int Idade { get; set; }
}

/// <summary>
/// Informações completas de uma pessoa retornadas pela API.
/// </summary>
public class PessoaResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
    public bool EMenorDeIdade { get; set; }
}
