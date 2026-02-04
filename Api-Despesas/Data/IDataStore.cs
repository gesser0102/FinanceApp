namespace Api_Despesas.Data;

/// <summary>
/// Interface genérica para armazenamento de dados.
/// Define operações básicas de CRUD (criar, ler, atualizar, deletar).
/// </summary>
/// <typeparam name="T">Tipo de entidade a ser armazenada</typeparam>
public interface IDataStore<T> where T : class
{
    /// <summary>
    /// Busca todos os registros armazenados.
    /// </summary>
    Task<List<T>> ObterTodosAsync();

    /// <summary>
    /// Busca um registro específico pelo seu ID.
    /// </summary>
    Task<T?> ObterPorIdAsync(int id);

    /// <summary>
    /// Adiciona um novo registro.
    /// </summary>
    Task AdicionarAsync(T item);

    /// <summary>
    /// Atualiza um registro existente.
    /// </summary>
    Task AtualizarAsync(T item);

    /// <summary>
    /// Remove um registro pelo ID.
    /// </summary>
    Task RemoverAsync(int id);

    /// <summary>
    /// Salva todas as alterações no armazenamento físico.
    /// </summary>
    Task SalvarAsync();
}
