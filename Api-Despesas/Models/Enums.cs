namespace Api_Despesas.Models;

/// <summary>
/// Define os tipos de transações financeiras disponíveis no sistema.
/// </summary>
public enum TipoTransacao
{
    /// <summary>
    /// Representa uma saída de dinheiro (gasto).
    /// </summary>
    Despesa = 0,

    /// <summary>
    /// Representa uma entrada de dinheiro (ganho).
    /// </summary>
    Receita = 1
}

/// <summary>
/// Define para qual tipo de transação uma categoria pode ser utilizada.
/// </summary>
public enum FinalidadeCategoria
{
    /// <summary>
    /// Categoria pode ser usada apenas para despesas.
    /// </summary>
    Despesa = 0,

    /// <summary>
    /// Categoria pode ser usada apenas para receitas.
    /// </summary>
    Receita = 1,

    /// <summary>
    /// Categoria pode ser usada tanto para despesas quanto para receitas.
    /// </summary>
    Ambas = 2
}
