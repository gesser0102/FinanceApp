using Microsoft.EntityFrameworkCore;
using Api_Despesas.Models;

namespace Api_Despesas.Data;

/// <summary>
/// DbContext para Entity Framework Core com SQLite
/// </summary>
public class AppDbContext : DbContext
{
    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração de Pessoa
        modelBuilder.Entity<Pessoa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Idade).IsRequired();
            entity.HasIndex(e => e.Nome);
        });

        // Configuração de Categoria
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Descricao).IsRequired().HasMaxLength(400);
            entity.Property(e => e.Finalidade).IsRequired();
            entity.HasIndex(e => e.Descricao);
        });

        // Configuração de Transacao
        modelBuilder.Entity<Transacao>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Descricao).IsRequired().HasMaxLength(400);
            entity.Property(e => e.Valor).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(e => e.Tipo).IsRequired();

            // Relacionamentos (sem foreign keys - mantém comportamento atual)
            entity.Property(e => e.CategoriaId).IsRequired();
            entity.Property(e => e.PessoaId).IsRequired();

            // Índices para performance
            entity.HasIndex(e => e.CategoriaId);
            entity.HasIndex(e => e.PessoaId);
            entity.HasIndex(e => e.Tipo);
        });
    }
}
