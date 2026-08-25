using System;
using System.Collections.Generic;
using System.Data;
using Evolucional.Application.Abstractions;
using Evolucional.Application.Common;
using Evolucional.Application.Matriculas;
using Evolucional.Application.Turmas;
using Evolucional.Domain.Entities;
using Evolucional.Domain.Exceptions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Evolucional.Application.Tests
{
    [TestClass]
    public sealed class MatriculaServiceTests
    {
        [TestMethod]
        public void DeveCriarMatriculaFazerCommitEInvalidarCache()
        {
            var scenario = new Scenario();

            var result = scenario.Service.Criar(new CriarMatriculaCommand
            {
                AlunoId = 10,
                TurmaId = 20
            });

            Assert.AreEqual(101, result.Id);
            Assert.AreEqual(10, result.AlunoId);
            Assert.AreEqual(20, result.TurmaId);
            Assert.AreEqual(IsolationLevel.Serializable, scenario.Connection.LastTransaction.IsolationLevel);
            Assert.AreEqual(1, scenario.Connection.LastTransaction.CommitCalls);
            Assert.AreEqual(0, scenario.Connection.LastTransaction.RollbackCalls);
            Assert.AreEqual(1, scenario.TurmaRepository.DecrementCalls);
            Assert.AreSame(scenario.Connection, scenario.TurmaRepository.ReceivedConnection);
            Assert.AreSame(scenario.Connection.LastTransaction, scenario.TurmaRepository.ReceivedTransaction);
            Assert.AreEqual(10, scenario.MatriculaRepository.Inserted.AlunoId);
            Assert.AreEqual(20, scenario.MatriculaRepository.Inserted.TurmaId);
            Assert.AreSame(scenario.Connection, scenario.MatriculaRepository.ReceivedConnection);
            Assert.AreSame(scenario.Connection.LastTransaction, scenario.MatriculaRepository.ReceivedTransaction);
            Assert.AreEqual(1, scenario.Cache.InvalidateCalls);
        }

        [TestMethod]
        public void DeveRecusarAlunoInativoEFazerRollback()
        {
            var scenario = new Scenario();
            scenario.AlunoRepository.Aluno.Ativo = false;

            var exception = AssertThrows<AlunoInativoException>(() => scenario.Service.Criar(Command()));

            Assert.AreEqual("ALUNO_INATIVO", exception.Code);
            Assert.AreEqual(1, scenario.Connection.LastTransaction.RollbackCalls);
            Assert.AreEqual(0, scenario.Connection.LastTransaction.CommitCalls);
            Assert.AreEqual(0, scenario.Cache.InvalidateCalls);
        }

        [TestMethod]
        public void DeveRecusarTurmaSemVagaEFazerRollback()
        {
            var scenario = new Scenario();
            scenario.TurmaRepository.Turma.VagasDisponiveis = 0;

            var exception = AssertThrows<TurmaSemVagaException>(() => scenario.Service.Criar(Command()));

            Assert.AreEqual("TURMA_SEM_VAGA", exception.Code);
            Assert.AreEqual(1, scenario.Connection.LastTransaction.RollbackCalls);
            Assert.AreEqual(0, scenario.Connection.LastTransaction.CommitCalls);
            Assert.AreEqual(0, scenario.MatriculaRepository.InsertCalls);
            Assert.AreEqual(0, scenario.Cache.InvalidateCalls);
        }

        [TestMethod]
        public void DeveRecusarMatriculaDuplicadaEFazerRollback()
        {
            var scenario = new Scenario();
            scenario.MatriculaRepository.ExistsResult = true;

            var exception = AssertThrows<MatriculaDuplicadaException>(() => scenario.Service.Criar(Command()));

            Assert.AreEqual("MATRICULA_DUPLICADA", exception.Code);
            Assert.AreEqual(1, scenario.Connection.LastTransaction.RollbackCalls);
            Assert.AreEqual(0, scenario.Connection.LastTransaction.CommitCalls);
            Assert.AreEqual(0, scenario.MatriculaRepository.InsertCalls);
            Assert.AreEqual(0, scenario.TurmaRepository.DecrementCalls);
            Assert.AreEqual(0, scenario.Cache.InvalidateCalls);
        }

        [TestMethod]
        public void DeveRecusarAlunoInexistenteEFazerRollback()
        {
            var scenario = new Scenario();
            scenario.AlunoRepository.Aluno = null;

            var exception = AssertThrows<ResourceNotFoundException>(() => scenario.Service.Criar(Command()));

            Assert.AreEqual("ALUNO_NAO_ENCONTRADO", exception.Code);
            Assert.AreEqual(1, scenario.Connection.LastTransaction.RollbackCalls);
            Assert.AreEqual(0, scenario.Connection.LastTransaction.CommitCalls);
            Assert.AreEqual(0, scenario.Cache.InvalidateCalls);
        }

        [TestMethod]
        public void DeveRecusarTurmaInexistenteEFazerRollback()
        {
            var scenario = new Scenario();
            scenario.TurmaRepository.Turma = null;

            var exception = AssertThrows<ResourceNotFoundException>(() => scenario.Service.Criar(Command()));

            Assert.AreEqual("TURMA_NAO_ENCONTRADA", exception.Code);
            Assert.AreEqual(1, scenario.Connection.LastTransaction.RollbackCalls);
            Assert.AreEqual(0, scenario.Connection.LastTransaction.CommitCalls);
            Assert.AreEqual(0, scenario.Cache.InvalidateCalls);
        }

        [TestMethod]
        public void DeveFazerRollbackQuandoNaoConsegueDecrementarVaga()
        {
            var scenario = new Scenario();
            scenario.TurmaRepository.DecrementResult = 0;

            var exception = AssertThrows<TurmaSemVagaException>(() => scenario.Service.Criar(Command()));

            Assert.AreEqual("TURMA_SEM_VAGA", exception.Code);
            Assert.AreEqual(1, scenario.MatriculaRepository.InsertCalls);
            Assert.AreEqual(1, scenario.TurmaRepository.DecrementCalls);
            Assert.AreEqual(1, scenario.Connection.LastTransaction.RollbackCalls);
            Assert.AreEqual(0, scenario.Connection.LastTransaction.CommitCalls);
            Assert.AreEqual(0, scenario.Cache.InvalidateCalls);
        }

        private static CriarMatriculaCommand Command()
        {
            return new CriarMatriculaCommand
            {
                AlunoId = 10,
                TurmaId = 20
            };
        }

        private static TException AssertThrows<TException>(Action action)
            where TException : Exception
        {
            try
            {
                action();
            }
            catch (TException exception)
            {
                return exception;
            }
            catch (Exception exception)
            {
                Assert.Fail(string.Format(
                    "Esperava {0}, mas recebeu {1}: {2}",
                    typeof(TException).Name,
                    exception.GetType().Name,
                    exception.Message));
            }

            Assert.Fail(string.Format(
                "Esperava uma exceção do tipo {0}.",
                typeof(TException).Name));
            return null;
        }

        private sealed class Scenario
        {
            public Scenario()
            {
                ConnectionFactory = new FakeConnectionFactory();
                Connection = ConnectionFactory.Connection;
                AlunoRepository = new FakeAlunoRepository
                {
                    Aluno = new Aluno
                    {
                        Id = 10,
                        Nome = "Aluno Teste",
                        Ativo = true
                    }
                };
                TurmaRepository = new FakeTurmaRepository
                {
                    Turma = new Turma
                    {
                        Id = 20,
                        Nome = "Turma Teste",
                        VagasTotal = 2,
                        VagasDisponiveis = 1
                    }
                };
                MatriculaRepository = new FakeMatriculaRepository();
                Cache = new FakeTurmaCache();
                Service = new MatriculaService(
                    ConnectionFactory,
                    AlunoRepository,
                    TurmaRepository,
                    MatriculaRepository,
                    Cache);
            }

            public FakeConnectionFactory ConnectionFactory { get; private set; }

            public FakeDbConnection Connection { get; private set; }

            public FakeAlunoRepository AlunoRepository { get; private set; }

            public FakeTurmaRepository TurmaRepository { get; private set; }

            public FakeMatriculaRepository MatriculaRepository { get; private set; }

            public FakeTurmaCache Cache { get; private set; }

            public MatriculaService Service { get; private set; }
        }

        private sealed class FakeConnectionFactory : IConnectionFactory
        {
            public FakeConnectionFactory()
            {
                Connection = new FakeDbConnection();
            }

            public FakeDbConnection Connection { get; private set; }

            public IDbConnection Create()
            {
                return Connection;
            }
        }

        private sealed class FakeDbConnection : IDbConnection
        {
            public FakeDbConnection()
            {
                State = ConnectionState.Closed;
            }

            public FakeDbTransaction LastTransaction { get; private set; }

            public string ConnectionString { get; set; }

            public int ConnectionTimeout { get { return 0; } }

            public string Database { get { return "FakeDatabase"; } }

            public ConnectionState State { get; private set; }

            private StateChangeEventHandler _stateChange;

            public event StateChangeEventHandler StateChange
            {
                add { _stateChange += value; }
                remove { _stateChange -= value; }
            }

            public IDbTransaction BeginTransaction()
            {
                return BeginTransaction(IsolationLevel.ReadCommitted);
            }

            public IDbTransaction BeginTransaction(IsolationLevel il)
            {
                LastTransaction = new FakeDbTransaction(this, il);
                return LastTransaction;
            }

            public void ChangeDatabase(string databaseName)
            {
            }

            public void Close()
            {
                State = ConnectionState.Closed;
            }

            public IDbCommand CreateCommand()
            {
                throw new NotSupportedException();
            }

            public void Open()
            {
                State = ConnectionState.Open;
            }

            public void Dispose()
            {
                Close();
            }
        }

        private sealed class FakeDbTransaction : IDbTransaction
        {
            public FakeDbTransaction(IDbConnection connection, IsolationLevel isolationLevel)
            {
                Connection = connection;
                IsolationLevel = isolationLevel;
            }

            public int CommitCalls { get; private set; }

            public int RollbackCalls { get; private set; }

            public IDbConnection Connection { get; private set; }

            public IsolationLevel IsolationLevel { get; private set; }

            public void Commit()
            {
                CommitCalls++;
            }

            public void Rollback()
            {
                RollbackCalls++;
            }

            public void Dispose()
            {
            }
        }

        private sealed class FakeAlunoRepository : IAlunoRepository
        {
            public Aluno Aluno { get; set; }

            public PagedResult<Aluno> Listar(string nome, int offset, int pageSize)
            {
                throw new NotSupportedException();
            }

            public Aluno ObterPorId(int id)
            {
                throw new NotSupportedException();
            }

            public Aluno ObterPorId(int id, IDbConnection connection, IDbTransaction transaction)
            {
                return Aluno;
            }

            public int Inserir(Aluno aluno)
            {
                throw new NotSupportedException();
            }

            public int Atualizar(Aluno aluno)
            {
                throw new NotSupportedException();
            }

            public int Desativar(int id)
            {
                throw new NotSupportedException();
            }
        }

        private sealed class FakeTurmaRepository : ITurmaRepository
        {
            public Turma Turma { get; set; }

            public int DecrementResult { get; set; } = 1;

            public int DecrementCalls { get; private set; }

            public IDbConnection ReceivedConnection { get; private set; }

            public IDbTransaction ReceivedTransaction { get; private set; }

            public IReadOnlyList<Turma> Listar()
            {
                throw new NotSupportedException();
            }

            public Turma ObterPorId(int id)
            {
                throw new NotSupportedException();
            }

            public Turma ObterPorIdParaAtualizacao(int id, IDbConnection connection, IDbTransaction transaction)
            {
                ReceivedConnection = connection;
                ReceivedTransaction = transaction;
                return Turma;
            }

            public int DecrementarVaga(int turmaId, IDbConnection connection, IDbTransaction transaction)
            {
                DecrementCalls++;
                ReceivedConnection = connection;
                ReceivedTransaction = transaction;
                return DecrementResult;
            }
        }

        private sealed class FakeMatriculaRepository : IMatriculaRepository
        {
            public bool ExistsResult { get; set; }

            public int InsertResult { get; set; } = 101;

            public int InsertCalls { get; private set; }

            public Matricula Inserted { get; private set; }

            public IDbConnection ReceivedConnection { get; private set; }

            public IDbTransaction ReceivedTransaction { get; private set; }

            public bool Existe(int alunoId, int turmaId)
            {
                throw new NotSupportedException();
            }

            public bool Existe(int alunoId, int turmaId, IDbConnection connection, IDbTransaction transaction)
            {
                ReceivedConnection = connection;
                ReceivedTransaction = transaction;
                return ExistsResult;
            }

            public int Inserir(Matricula matricula)
            {
                throw new NotSupportedException();
            }

            public int Inserir(Matricula matricula, IDbConnection connection, IDbTransaction transaction)
            {
                InsertCalls++;
                Inserted = matricula;
                ReceivedConnection = connection;
                ReceivedTransaction = transaction;
                return InsertResult;
            }
        }

        private sealed class FakeTurmaCache : ITurmaCache
        {
            public int InvalidateCalls { get; private set; }

            public bool TentarObter(out IReadOnlyList<TurmaDto> turmas)
            {
                turmas = null;
                return false;
            }

            public void Armazenar(IReadOnlyList<TurmaDto> turmas)
            {
            }

            public void Invalidar()
            {
                InvalidateCalls++;
            }
        }
    }
}
