import { FormEvent, useEffect, useRef, useState } from 'react';

import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setIsLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed);

  const itemsText = activeTodosCount === 1 ? 'item' : 'items';

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const title = query.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    const todo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todo);

    addTodo({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);

        setQuery('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(current => [...current, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(current => current.filter(item => item !== id));

        inputRef.current?.focus();
      });
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <form onSubmit={handleSubmit}>
        <div className="todoapp__header">
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={event => setQuery(event.target.value)}
            disabled={tempTodo !== null}
          />
        </div>
      </form>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light ${error ? '' : 'hidden'}`}
      >
        <button
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>

      {isLoading && <div data-cy="TodoLoader">Loading...</div>}

      {todos.length > 0 && (
        <>
          <section className="todoapp__main">
            {visibleTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label>
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                  />

                  <span data-cy="TodoTitle">{todo.title}</span>
                </label>

                <div
                  data-cy="TodoLoader"
                  className={`todo__loader ${
                    loadingIds.includes(todo.id) ? 'is-active' : 'hidden'
                  }`}
                >
                  <div className="loader" />
                </div>

                <button
                  type="button"
                  className="todo__delete"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>
              </div>
            ))}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label>
                  <input type="checkbox" checked={false} readOnly />

                  <span data-cy="TodoTitle">{tempTodo.title}</span>
                </label>

                <div data-cy="TodoLoader" className="todo__loader is-active">
                  <div className="loader" />
                </div>

                <button type="button" className="todo__delete" disabled>
                  ×
                </button>
              </div>
            )}
          </section>

          <footer className="todoapp__footer">
            <span data-cy="TodosCounter">
              {activeTodosCount} {itemsText} left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={filter === Filter.All ? 'selected' : ''}
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={filter === Filter.Active ? 'selected' : ''}
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={filter === Filter.Completed ? 'selected' : ''}
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              disabled={!completedTodos.length}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        </>
      )}
    </div>
  );
};
