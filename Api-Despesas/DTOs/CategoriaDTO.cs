using System.ComponentModel.DataAnnotations;
using Api_Despesas.Models;

namespace Api_Despesas.DTOs;

/// <summary>
/// Dados necessários para criar uma nova categoria no sistema.
/// </summary>
public class CriarCategoriaRequest
{
    /// <summary>
    /// Descrição da categoria (obrigatória, máximo 400 caracteres).
    /// </summary>
    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(400, MinimumLength = 1, ErrorMessage = "A descrição deve ter entre 1 e 400 caracteres")]
    public string Descricao { get; set; } = string.Empty;

    /// <summary>
    /// Define se a categoria é para despesa, receita ou ambas (obrigatório).
    /// Valores aceitos: 0 = Despesa, 1 = Receita, 2 = Ambas.
    /// </summary>
    [Required(ErrorMessage = "A finalidade é obrigatória")]
    [EnumDataType(typeof(FinalidadeCategoria), ErrorMessage = "Finalidade inválida. Use 0=Despesa, 1=Receita ou 2=Ambas")]
    public FinalidadeCategoria Finalidade { get; set; }
}

/// <summary>
/// Informações completas de uma categoria retornadas pela API.
/// </summary>
public class CategoriaResponse
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public FinalidadeCategoria Finalidade { get; set; }
    public string FinalidadeTexto { get; set; } = string.Empty;
}
