# Backend .NET — Teste Prático Evolucional

Este diretório contém exclusivamente o backend do teste técnico.

## Visão geral

API de controle de matrículas escolares desenvolvida com ASP.NET Web API sobre .NET Framework 4.8. A aplicação disponibiliza:

- CRUD de alunos, com paginação, filtro por nome e exclusão lógica;
- listagem de turmas com vagas disponíveis;
- criação de matrículas com regras de negócio e transação;
- relatório de alunos matriculados por turma;
- cache em memória para a listagem de turmas, com expiração e invalidação após uma matrícula confirmada.

## Stack

- .NET Framework 4.8;
- ASP.NET Web API 2;
- SQL Server ou LocalDB;
- Dapper;
- SQL escrito manualmente, sem Entity Framework;
- IIS Express para execução local.

## Pré-requisitos

- Windows;
- Visual Studio 2022 com a carga de trabalho de desenvolvimento ASP.NET e Web;
- .NET Framework 4.8 Developer Pack;
- SQL Server, SQL Server Express ou LocalDB;
- NuGet para restauração dos pacotes da solução.

O LocalDB normalmente é instalado junto com o Visual Studio. O banco padrão utilizado pela aplicação é `(localdb)\MSSQLLocalDB`.

## Estrutura do backend

```text
csharp/
├── database/
│   └── script-banco.sql
├── src/
│   ├── Evolucional.Api/            # Controllers, filtros e configuração Web API
│   ├── Evolucional.Application/    # Serviços, DTOs e contratos
│   ├── Evolucional.Domain/         # Entidades e exceções de negócio
│   └── Evolucional.Infrastructure/ # Dapper, SQL, repositórios e cache
├── tests/
│   └── Evolucional.Application.Tests/ # Testes das regras de matrícula
├── Evolucional.sln
└── README.md
```

## Configuração do banco

O script cria o banco `TesteEscola`, suas tabelas e dados de exemplo:

```text
database/script-banco.sql
```

### Usando o SQL Server Management Studio

1. Abra o SQL Server Management Studio ou o SQL Server Object Explorer do Visual Studio.
2. Conecte-se à instância `(localdb)\MSSQLLocalDB` usando autenticação do Windows.
3. Abra e execute todo o arquivo `database/script-banco.sql`.

O script recria as tabelas `Aluno`, `Turma` e `Matricula`. Portanto, sua execução apaga os dados dessas tabelas antes de inserir a massa inicial de exemplo. Ele deve ser usado apenas para preparar o ambiente local do teste.

### Usando `sqlcmd`

Com o `sqlcmd` instalado, execute na pasta `csharp`:

```powershell
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -i .\database\script-banco.sql
```

## Connection string

A connection string padrão está em:

```text
src/Evolucional.Api/Web.config
```

```xml
<connectionStrings>
  <add name="TesteEscola"
       connectionString="Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=TesteEscola;Integrated Security=True;MultipleActiveResultSets=True"
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

Se outra instância ou servidor SQL Server for utilizado, altere apenas essa configuração. O nome da connection string deve continuar sendo `TesteEscola`, pois ele é utilizado pelo `SqlConnectionFactory`.

## Como executar

1. Abra `Evolucional.sln` no Visual Studio.
2. Restaure os pacotes NuGet da solução.
3. Defina `Evolucional.Api` como projeto de inicialização.
4. Confirme que o banco foi criado e que a connection string está correta.
5. Execute com `F5` ou `Ctrl+F5` para iniciar pelo IIS Express.

A porta HTTPS configurada para o IIS Express é `44300`, mas a URL efetiva pode ser confirmada na saída do Visual Studio. Considerando a configuração padrão, a API estará disponível em:

```text
https://localhost:44300
```

Este é um projeto ASP.NET Web API clássico sobre .NET Framework 4.8; ele não é executado com `dotnet run` como uma aplicação ASP.NET Core.

### Compilação pela linha de comando

Com `NuGet.exe` e MSBuild disponíveis no `PATH`, é possível restaurar e compilar a solução assim:

```powershell
cd csharp
nuget restore .\Evolucional.sln
dotnet build .\Evolucional.sln --no-restore
```

## Endpoints

Nos exemplos abaixo, `BASE_URL` representa a URL da API, por exemplo `https://localhost:44300`.

### Alunos

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| GET | `/api/alunos` | Lista alunos ativos com paginação e filtro opcional por nome | 200 |
| GET | `/api/alunos/{id}` | Busca um aluno pelo ID | 200 |
| POST | `/api/alunos` | Cria um aluno | 201 |
| PUT | `/api/alunos/{id}` | Atualiza um aluno | 200 |
| DELETE | `/api/alunos/{id}` | Desativa o aluno sem remover o registro | 200 |

Listagem paginada:

```http
GET /api/alunos?nome=Ana&page=1&pageSize=10
```

Resposta:

```json
{
  "items": [
    {
      "id": 1,
      "nome": "Ana Souza",
      "email": "ana.souza@email.com",
      "dataNascimento": "2006-03-14T00:00:00",
      "ativo": true,
      "dataCadastro": "2026-08-24T00:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

O filtro `nome` é opcional. `page` deve ser maior que zero e `pageSize` deve estar entre 1 e 100. A listagem considera apenas alunos ativos.

Criação:

```http
POST /api/alunos
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "dataNascimento": "2006-04-10"
}
```

Atualização:

```http
PUT /api/alunos/1
Content-Type: application/json

{
  "nome": "Ana Souza Atualizada",
  "email": "ana.atualizada@email.com",
  "dataNascimento": "2006-03-14"
}
```

A exclusão é lógica: o endpoint `DELETE` altera `Ativo` para `false` e mantém o registro no banco.

### Turmas

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| GET | `/api/turmas` | Lista turmas, incluindo total e saldo de vagas | 200 |

```http
GET /api/turmas
```

Resposta:

```json
[
  {
    "id": 1,
    "nome": "3A - Ensino Medio",
    "periodo": "Manha",
    "vagasTotal": 30,
    "vagasDisponiveis": 28
  }
]
```

A listagem utiliza um cache em memória com validade de cinco minutos. Uma matrícula confirmada invalida o cache depois do `commit` da transação, garantindo que a próxima consulta busque as vagas atualizadas no banco.

### Matrículas

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| POST | `/api/matriculas` | Matricula um aluno em uma turma | 201 |

```http
POST /api/matriculas
Content-Type: application/json

{
  "alunoId": 1,
  "turmaId": 2
}
```

Resposta:

```json
{
  "id": 9,
  "alunoId": 1,
  "turmaId": 2
}
```

A operação executa a inclusão em `Matricula` e o decremento de `VagasDisponiveis` na mesma transação. Se uma das operações falhar, o `rollback` desfaz todas as alterações.

Regras aplicadas:

- o aluno precisa existir e estar ativo;
- a turma precisa existir e ter vagas disponíveis;
- o mesmo aluno não pode ser matriculado duas vezes na mesma turma;
- a restrição única do banco também protege a combinação `AlunoId` + `TurmaId`.

### Relatório

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| GET | `/api/relatorios/alunos-por-turma` | Retorna quantidade de matriculados e vagas restantes por turma | 200 |

```http
GET /api/relatorios/alunos-por-turma
```

Resposta:

```json
[
  {
    "turmaId": 1,
    "nomeTurma": "3A - Ensino Medio",
    "quantidadeAlunosMatriculados": 2,
    "vagasRestantes": 28
  }
]
```

O resultado é produzido diretamente no SQL com `LEFT JOIN`, `COUNT` e `GROUP BY`, sem montar o relatório em memória no C#.

## Status HTTP e erros

As respostas de erro seguem o formato:

```json
{
  "code": "TURMA_SEM_VAGA",
  "message": "A turma não possui vagas disponíveis."
}
```

| Status | Uso |
|---|---|
| 200 | Consulta, atualização ou desativação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Corpo ausente, dados inválidos, IDs inválidos ou paginação inválida |
| 404 | Aluno ou turma não encontrado |
| 409 | Regra de negócio impede a operação |
| 500 | Erro inesperado do servidor |

Principais códigos de regra de negócio:

- `ALUNO_INATIVO`;
- `TURMA_SEM_VAGA`;
- `MATRICULA_DUPLICADA`.

## Decisões técnicas

- A solução foi mantida em .NET Framework 4.8, conforme o enunciado.
- O acesso ao SQL Server usa Dapper e consultas SQL explícitas em `Infrastructure/Sql`.
- A aplicação é separada em API, Application, Domain e Infrastructure.
- A matrícula usa transação com isolamento `Serializable` e bloqueio da turma para evitar inconsistência de vagas em operações concorrentes.
- O cache foi abstraído pela interface `ITurmaCache`. A implementação entregue é local, em memória, sem dependência de Redis. Em um ambiente distribuído, essa interface pode receber uma implementação Redis sem alterar os serviços da aplicação.

## Validação realizada

A solução foi compilada com sucesso usando:

```powershell
dotnet build .\Evolucional.sln --no-restore
```

Os testes unitários das regras de matrícula estão em `tests/Evolucional.Application.Tests` e usam MSTest. Eles cobrem o fluxo de sucesso, aluno inativo, turma sem vaga, matrícula duplicada, aluno ou turma inexistente e rollback quando o decremento da vaga falha.

No Visual Studio, os testes podem ser executados pelo Test Explorer. Pela linha de comando, após compilar a solução, use o `vstest.console.exe` instalado junto com o Visual Studio e informe o caminho do adaptador MSTest:

```powershell
vstest.console.exe .\tests\Evolucional.Application.Tests\bin\Evolucional.Application.Tests.dll `
  /TestAdapterPath:.\packages\MSTest.TestAdapter.4.3.3\buildTransitive\net462
```

Validação atual: 7 testes aprovados, 0 falhas e 0 ignorados.
