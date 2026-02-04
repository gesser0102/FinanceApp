namespace Api_Despesas.DTOs;

/// <summary>
/// Totalizadores financeiros de uma pessoa específica.
/// </summary>
public class TotaisPorPessoaResponse
{
    public int PessoaId { get; set; }
    public string NomePessoa { get; set; } = string.Empty;
    public int Idade { get; set; }

    /// <summary>
    /// Soma de todas as receitas desta pessoa.
    /// </summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>
    /// Soma de todas as despesas desta pessoa.
    /// </summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>
    /// Saldo líquido (receitas - despesas).
    /// Positivo: pessoa está com dinheiro sobrando.
    /// Negativo: pessoa está devendo ou gastou mais do que ganhou.
    /// </summary>
    public decimal Saldo { get; set; }
}

/// <summary>
/// Relatório completo com totais de todas as pessoas e totalizadores gerais.
/// </summary>
public class RelatorioTotaisPorPessoaResponse
{
    /// <summary>
    /// Lista com os totais individuais de cada pessoa cadastrada.
    /// </summary>
    public List<TotaisPorPessoaResponse> TotaisPorPessoa { get; set; } = new();

    /// <summary>
    /// Totalizadores gerais somando todas as pessoas.
    /// </summary>
    public TotaisGeraisResponse TotaisGerais { get; set; } = new();
}

/// <summary>
/// Totalizadores financeiros de uma categoria específica.
/// </summary>
public class TotaisPorCategoriaResponse
{
    public int CategoriaId { get; set; }
    public string NomeCategoria { get; set; } = string.Empty;
    public string Finalidade { get; set; } = string.Empty;

    /// <summary>
    /// Soma de todas as receitas nesta categoria.
    /// </summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>
    /// Soma de todas as despesas nesta categoria.
    /// </summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>
    /// Saldo líquido da categoria (receitas - despesas).
    /// </summary>
    public decimal Saldo { get; set; }
}

/// <summary>
/// Relatório completo com totais de todas as categorias e totalizadores gerais.
/// </summary>
public class RelatorioTotaisPorCategoriaResponse
{
    /// <summary>
    /// Lista com os totais individuais de cada categoria cadastrada.
    /// </summary>
    public List<TotaisPorCategoriaResponse> TotaisPorCategoria { get; set; } = new();

    /// <summary>
    /// Totalizadores gerais somando todas as categorias.
    /// </summary>
    public TotaisGeraisResponse TotaisGerais { get; set; } = new();
}

/// <summary>
/// Totalizadores gerais do sistema.
/// </summary>
public class TotaisGeraisResponse
{
    /// <summary>
    /// Soma total de todas as receitas no sistema.
    /// </summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>
    /// Soma total de todas as despesas no sistema.
    /// </summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>
    /// Saldo líquido geral (total receitas - total despesas).
    /// </summary>
    public decimal SaldoLiquido { get; set; }
}
