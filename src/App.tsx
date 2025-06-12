import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodo.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);
    setLoading(true);

    try {
      const newCreatedTodo = await createTodo(temp);

      setTodos(prev => [...prev, newCreatedTodo]);
      setNewTodo('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleToggleTodo = async (id: number) => {
    const existingTodo = todos.find(todo => todo.id === id);

    if (!existingTodo) {
      return;
    }

    setError('');
    setLoadingTodos(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, {
        completed: !existingTodo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(item => (item.id === id ? updatedTodo : item)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleAll = () => {
    todos.forEach(todo => handleToggleTodo(todo.id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(prev => prev.filter(t => t.id !== todo.id));
          })
          .catch(() => {
            setError('Unable to delete a todo');
          }),
      ),
    );
    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
            disabled={loading}
          />

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              placeholder="What needs to be done?"
              className="todoapp__new-todo"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              ref={inputRef}
              disabled={loading}
              data-cy="NewTodoField"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            const isLoading = loadingTodos.includes(todo.id);

            return (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label
                  className="todo__status-label"
                  aria-label={
                    todo.completed ? 'Mark as active' : 'Mark as completed'
                  }
                >
                  <input
                    type="checkbox"
                    className="todo__status"
                    data-cy="TodoStatus"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    disabled={isLoading}
                  />
                </label>

                <span className="todo__title" data-cy="TodoTitle">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDeleteTodo(todo.id)}
                  disabled={isLoading}
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${isLoading ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {tempTodo && (
            <div className="todo" data-cy="Todo">
              <input type="checkbox" className="todo__status" disabled />
              <span className="todo__title" data-cy="TodoTitle">
                {tempTodo.title}
              </span>
              <div
                data-cy="TodoLoader"
                className={`modal overlay ${loading ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
              disabled={todos.every(todo => !todo.completed)}
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={`notification is-danger is-light has-text-weight-normal closehidden ${error ? '' : 'hidden'}`}
        data-cy="ErrorNotification"
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError('')}
          data-cy="HideErrorButton"
        />
        {error}
      </div>
    </div>
  );
};
