using Api_Despesas.Data;
using Api_Despesas.Models;
using Api_Despesas.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Configuração de Serviços
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS para permitir requisições do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configuração do Entity Framework Core com SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=despesas.db"));

// Injeção de Dependências
builder.Services.AddScoped<IDataStore<Pessoa>, EfDataStore<Pessoa>>();
builder.Services.AddScoped<IDataStore<Categoria>, EfDataStore<Categoria>>();
builder.Services.AddScoped<IDataStore<Transacao>, EfDataStore<Transacao>>();
builder.Services.AddScoped<PessoaService>();
builder.Services.AddScoped<CategoriaService>();
builder.Services.AddScoped<TransacaoService>();

var app = builder.Build();

// Aplicar migrations automaticamente ao iniciar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Pipeline de Requisições
app.MapOpenApi();
app.MapScalarApiReference();
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();
