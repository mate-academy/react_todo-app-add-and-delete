/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // Verifica se tem usuário logado
  if (!USER_ID) {
    return <UserWarning />;
  }

  // Estados para gerenciar os todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editing, setEditing] = useState<{
    id: number | null;
    title: string;
  }>({ id: null, title: '' });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRef = useRef<HTMLInputElement>(null);
  // Estado para ids de todos sendo deletados
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Busca os todos quando o componente carrega
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setLoading('carregando');
    setError('');
    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(data => setTodos(data))
      .catch(() => setError('Erro ao carregar tarefas'))
      .finally(() => setLoading(null));
  }, []);

  // Foca no input quando necessário
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  // Função para adicionar novo todo
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTodo.trim();

    if (!title) {
      setError('Digite uma tarefa');

      return;
    }

    // Cria um todo temporário enquanto carrega
    const temp = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false
    };

    setTempTodo(temp);
    setLoading('adicionando');
    setNewTodo('');

    // Envia para o servidor
    client.post<Todo>('/todos', temp)
      .then(addedTodo => {
        setTodos(prev => [...prev, addedTodo]);
      })
      .catch(() => {
        setError('Erro ao adicionar tarefa');
        setNewTodo(title);
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(null);
      });
  };

  // Função para deletar todo
  const deleteTodo = (id: number) => {
    setDeletingIds(prev => [...prev, id]);
    setLoading(`deletando-${id}`);

    client.delete(`/todos/${id}`)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError('Erro ao deletar tarefa'))
      .finally(() => {
        setLoading(null);
        setDeletingIds(prev => prev.filter(delId => delId !== id));
      });
  };

  // Função para marcar/desmarcar como completo
  const toggleComplete = (id: number) => {
    setLoading(`completando-${id}`);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    client.patch<Todo>(`/todos/${id}`, { completed: !todo.completed })
      .then((updated) => {
        setTodos(prev => prev.map(t =>
          t.id === id ? updated : t
        ));
      })
      .catch(() => setError('Erro ao atualizar tarefa'))
      .finally(() => setLoading(null));
  };

  // Função para editar todo
  const editTodo = (id: number) => {
    const title = editing.title.trim();

    if (!title) {
      setError('Digite um título válido');

      return;
    }

    setLoading(`editando-${id}`);

    client.patch<Todo>(`/todos/${id}`, {title})
      .then(updated => {
        setTodos(prev => prev.map(t =>
          t.id === id ? updated : t
        ));
        setEditing({id: null, title: ''});
      })
      .catch(() => setError('Erro ao editar tarefa'))
      .finally(() => setLoading(null));
  };

  // Função para marcar/desmarcar todos
  const toggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const newStatus = !allCompleted;

    setLoading('completando-todos');

    Promise.all(
      todos.map(todo =>
        client.patch(`/todos/${todo.id}`, {completed: newStatus})
      )
    )
      .then(() => {
        setTodos(prev => prev.map(t => ({...t, completed: newStatus})));
      })
      .catch(() => setError('Erro ao atualizar tarefas'))
      .finally(() => setLoading(null));
  };

  // Função para limpar completos
  const clearCompleted = () => {
    setLoading('limpando');
    const completed = todos.filter(t => t.completed);

    Promise.all(
      completed.map(t => client.delete(`/todos/${t.id}`))
    )
      .then(() => {
        setTodos(prev => prev.filter(t => !t.completed));
      })
      .catch(() => setError('Erro ao limpar tarefas'))
      .finally(() => setLoading(null));
  };

  // Filtra os todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // Conta tarefas ativas
  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {/* Cabeçalho com input */}
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${activeCount === 0 ? 'active' : ''}`}
            onClick={toggleAll}
            disabled={loading === 'completando-todos'}
            data-cy="ToggleAllButton"
            aria-label="Completar todos"
          />

          <form style={{ position: 'relative' }} onSubmit={addTodo}>
            <input
              ref={inputRef}
              type="text"
              data-cy="NewTodoField"
              className="todoapp__new-todo"
              placeholder="O que precisa ser feito?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={!!loading}
            />
            {/* Overlay de loading sobre o input ao adicionar */}
            {tempTodo && (
              <div className="loading-overlay">
                <div className="loading-spinner" />
              </div>
            )}
          </form>
        </header>

        {/* Lista de todos */}
        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
              style={{ position: 'relative' }}
            >
              <label className="todo__status-label">
                <input
                  className="todo__status"
                  type="checkbox"
                  data-cy="TodoStatus"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  disabled={loading === `completando-${todo.id}` || deletingIds.includes(todo.id)}
                />
              </label>

              {editing.id === todo.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  editTodo(todo.id);
                }}>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        title: e.target.value,
                      })
                    }
                    onBlur={() => editTodo(todo.id)}
                    autoFocus
                  />
                </form>
              ) : (
                <span
                  className="todo__title"
                  data-cy="TodoTitle"
                  onDoubleClick={() =>
                    setEditing({
                      id: todo.id,
                      title: todo.title,
                    })
                  }
                >
                  {todo.title}
                </span>
              )}

              <button
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
                disabled={loading === `deletando-${todo.id}` || deletingIds.includes(todo.id)}
              >
                ×
              </button>

              {/* Overlay de loading para deleção */}
              {deletingIds.includes(todo.id) && (
                <div className="loading-overlay">
                  <div className="loading-spinner" />
                </div>
              )}
            </div>
          ))}

          {/* Todo temporário durante carregamento */}
          {tempTodo && (
            <div className="todo" style={{ position: 'relative' }}>
              <div className="todo__status">
                <input type="checkbox" checked={false} disabled />
              </div>
              <div className="todo__title">{tempTodo.title}</div>
              <div className="loading-overlay">
                <div className="loading-spinner" />
              </div>
            </div>
          )}
        </section>

        {/* Rodapé com filtros */}
        {todos.length > 0 && (
          <footer
            className="todoapp__footer"
            data-cy="Footer"
          >
            <span
              className="todo-count"
              data-cy="TodosCounter"
            >{activeCount} itens restantes</span>

            <div
              className="filters"
              data-cy="Filter"
            >
              <button
                data-cy="FilterLinkAll"
                className={`filter__link${filter === 'all' ? ' selected' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                data-cy="FilterLinkActive"
                className={`filter__link${filter === 'completed' ? ' selected' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                data-cy="FilterLinkCompleted"
                className={filter === 'completed' ? 'selected' : ''}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>

            {hasCompleted && (
              <button
                data-cy="ClearCompletedButton"
                className="todoapp__clear-completed"
                onClick={clearCompleted}
                disabled={loading === 'limpando'}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div
          className="error-message"
          data-cy="ErrorNotification"
        >
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
    </div>
  );
};
