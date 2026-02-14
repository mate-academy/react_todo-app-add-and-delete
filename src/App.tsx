/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as doTodo from './api/todos';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const loadtodos = async () => {
    try {
      const data = await doTodo.getTodos();

      setTodos(data);
    } catch {
      setError(ErrorMessage.LoadTodos);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    loadtodos();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

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

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const hasCompleted = todos.some(todo => todo.completed);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    try {
      setIsAdding(true);

      const temp: Todo = {
        id: 0,
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(temp);

      const newTodo = await doTodo.addTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
    } catch {
      setError(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setTimeout(() => inputRef.current?.focus());
    }
  }

  function handleDelete(id: number) {
    setProcessingIds(prev => [...prev, id]);

    doTodo
      .deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setTimeout(() => inputRef.current?.focus());
      })
      .catch(() => setError(ErrorMessage.DeleteTodo))
      .finally(() => {
        setProcessingIds(prev => prev.filter(pid => pid !== id));
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      setProcessingIds(prev => [...prev, todo.id]);

      return doTodo
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => setError(ErrorMessage.DeleteTodo))
        .finally(() => {
          setProcessingIds(prev => prev.filter(id => id !== todo.id));
        });
    });

    Promise.all(deletePromises).then(() => {
      setTimeout(() => inputRef.current?.focus());
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    readOnly
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                  disabled={processingIds.includes(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${
                    processingIds.includes(todo.id) ? 'is-active' : ''
                  }`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    readOnly
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={`filter__link ${
                  filter === Filter.All ? 'selected' : ''
                }`}
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={`filter__link ${
                  filter === Filter.Active ? 'selected' : ''
                }`}
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={`filter__link ${
                  filter === Filter.Completed ? 'selected' : ''
                }`}
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              onClick={handleClearCompleted}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          error ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
