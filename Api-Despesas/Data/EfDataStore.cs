using Microsoft.EntityFrameworkCore;

namespace Api_Despesas.Data;

/// <summary>
/// Implementação de IDataStore usando Entity Framework Core com SQLite
/// </summary>
public class EfDataStore<T> : IDataStore<T> where T : class
{
    private readonly AppDbContext _context;
    private readonly DbSet<T> _dbSet;

    public EfDataStore(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<List<T>> ObterTodosAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T?> ObterPorIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task AdicionarAsync(T item)
    {
        _dbSet.Add(item);
        // Não chama SaveChanges aqui - será chamado em SalvarAsync()
    }

    public async Task AtualizarAsync(T item)
    {
        _dbSet.Update(item);
        // Não chama SaveChanges aqui - será chamado em SalvarAsync()
        await Task.CompletedTask;
    }

    public async Task RemoverAsync(int id)
    {
        var item = await ObterPorIdAsync(id);
        if (item != null)
        {
            _dbSet.Remove(item);
        }
        // Não chama SaveChanges aqui - será chamado em SalvarAsync()
    }

    public async Task SalvarAsync()
    {
        await _context.SaveChangesAsync();
    }
}
