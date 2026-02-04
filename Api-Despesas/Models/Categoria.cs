namespace Api_Despesas.Models;

/// <summary>
/// Representa uma categoria que classifica as transações financeiras.
/// Cada categoria define se pode ser usada para despesas, receitas ou ambas.
/// </summary>
public class Categoria
{
    /// <summary>
    /// Identificador único da categoria, gerado automaticamente pelo sistema (auto-increment).
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Descrição detalhada da categoria (máximo 400 caracteres).
    /// Exemplo: "Alimentação", "Salário", "Transporte".
    /// </summary>
    public string Descricao { get; set; } = string.Empty;

    /// <summary>
    /// Define para qual tipo de transação esta categoria pode ser utilizada.
    /// Despesa: só para gastos | Receita: só para ganhos | Ambas: qualquer tipo.
    /// </summary>
    public FinalidadeCategoria Finalidade { get; set; }

    /// <summary>
    /// Verifica se esta categoria pode ser usada para o tipo de transação informado.
    /// </summary>
    /// <param name="tipoTransacao">Tipo da transação que deseja validar</param>
    /// <returns>True se a categoria permite o tipo de transação, False caso contrário</returns>
    public bool PermiteTipoTransacao(TipoTransacao tipoTransacao)
    {
        // Se a finalidade é "Ambas", permite qualquer tipo de transação
        if (Finalidade == FinalidadeCategoria.Ambas)
            return true;

        // Verifica se a finalidade da categoria corresponde ao tipo da transação
        return (int)Finalidade == (int)tipoTransacao;
    }
}
