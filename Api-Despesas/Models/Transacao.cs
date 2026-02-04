namespace Api_Despesas.Models;

/// <summary>
/// Representa uma movimentação financeira (entrada ou saída de dinheiro).
/// Cada transação está ligada a uma pessoa e classificada em uma categoria.
/// </summary>
public class Transacao
{
    /// <summary>
    /// Identificador único da transação, gerado automaticamente pelo sistema (auto-increment).
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Descrição detalhada da transação (máximo 400 caracteres).
    /// Exemplo: "Compra no supermercado", "Pagamento do salário".
    /// </summary>
    public string Descricao { get; set; } = string.Empty;

    /// <summary>
    /// Valor da transação em reais (sempre positivo).
    /// </summary>
    public decimal Valor { get; set; }

    /// <summary>
    /// Define se é uma entrada (Receita) ou saída (Despesa) de dinheiro.
    /// </summary>
    public TipoTransacao Tipo { get; set; }

    /// <summary>
    /// Identificador da categoria à qual esta transação pertence.
    /// A categoria deve ser compatível com o tipo da transação.
    /// </summary>
    public int CategoriaId { get; set; }

    /// <summary>
    /// Identificador da pessoa responsável por esta transação.
    /// </summary>
    public int PessoaId { get; set; }
}
