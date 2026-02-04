using System.ComponentModel.DataAnnotations;
using Api_Despesas.Models;

namespace Api_Despesas.DTOs;

/// <summary>
/// Dados necessários para criar uma nova transação no sistema.
/// </summary>
public class CriarTransacaoRequest
{
    /// <summary>
    /// Descrição detalhada da transação (obrigatória, máximo 400 caracteres).
    /// </summary>
    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(400, MinimumLength = 1, ErrorMessage = "A descrição deve ter entre 1 e 400 caracteres")]
    public string Descricao { get; set; } = string.Empty;

    /// <summary>
    /// Valor da transação em reais (obrigatório, deve ser positivo).
    /// </summary>
    [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
    public decimal Valor { get; set; }

    /// <summary>
    /// Tipo da transação (obrigatório).
    /// Valores aceitos: 0 = Despesa, 1 = Receita.
    /// </summary>
    [Required(ErrorMessage = "O tipo é obrigatório")]
    [EnumDataType(typeof(TipoTransacao), ErrorMessage = "Tipo inválido. Use 0=Despesa ou 1=Receita")]
    public TipoTransacao Tipo { get; set; }

    /// <summary>
    /// ID da categoria (obrigatório).
    /// A categoria deve existir e ser compatível com o tipo da transação.
    /// </summary>
    [Required(ErrorMessage = "A categoria é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "ID da categoria inválido")]
    public int CategoriaId { get; set; }

    /// <summary>
    /// ID da pessoa (obrigatório).
    /// A pessoa deve existir. Se for menor de idade, só pode criar despesas.
    /// </summary>
    [Required(ErrorMessage = "A pessoa é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "ID da pessoa inválido")]
    public int PessoaId { get; set; }
}

/// <summary>
/// Informações completas de uma transação retornadas pela API.
/// </summary>
public class TransacaoResponse
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public string TipoTexto { get; set; } = string.Empty;
    public int CategoriaId { get; set; }
    public string CategoriaNome { get; set; } = string.Empty;
    public int PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
}
