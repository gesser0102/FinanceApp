namespace Api_Despesas.Models;

/// <summary>
/// Representa uma pessoa que pode realizar transações financeiras no sistema.
/// Cada pessoa tem suas próprias receitas e despesas controladas.
/// </summary>
public class Pessoa
{
    /// <summary>
    /// Identificador único da pessoa, gerado automaticamente pelo sistema (auto-increment).
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Nome completo da pessoa (máximo 200 caracteres).
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// Idade da pessoa em anos.
    /// Importante: menores de 18 anos só podem registrar despesas.
    /// </summary>
    public int Idade { get; set; }

    /// <summary>
    /// Verifica se a pessoa é menor de idade (menos de 18 anos).
    /// Usado para validar o tipo de transação permitida.
    /// </summary>
    public bool EMenorDeIdade() => Idade < 18;
}
