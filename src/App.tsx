/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

const noErrors = {
  loadError: false,
  titleError: false,
  addTodoError: false,
  deleteTodoError: false,
};

enum Filters {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState(noErrors);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingId, setIsLoadingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filters>(Filters.All);

  const handleHideError = () => {
    setErrors(noErrors);
  };

  const clearErrors = () => {
    setTimeout(() => {
      handleHideError();
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch (error) {
      setErrors({ ...noErrors, loadError: true });
    }
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      setIsLoadingId(-1);
      addTodo(inputValue)
        .then(result => {
          setIsLoadingId(result.id);
          setTodos(prev => [...prev, result]);
          setInputValue('');
          setTimeout(() => setIsLoadingId(null), 500);
        })
        .catch(() => {
          setErrors({ ...noErrors, addTodoError: true });
          clearErrors();
        });
    } else {
      setErrors({ ...noErrors, titleError: true });
      clearErrors();
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoadingId(id);
    try {
      const timer = setTimeout(() => {
        throw Error('no result');
      }, 5000);

      await deleteTodo(id);

      clearTimeout(timer);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setInputValue('');
      setTimeout(() => setIsLoadingId(null), 500);
    } catch (error) {
      setErrors({ ...noErrors, deleteTodoError: true });
      clearErrors();
    }
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (isLoadingId !== -1) {
        handleAdd();
      }
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);

      case Filters.Completed:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, filter, completedTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            // onClick={handleToggleAll}
          />

          <form onKeyDown={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            const { id, completed, title } = todo;

            return (
              <div
                key={id}
                data-cy="Todo"
                className={classNames('todo', { completed: completed })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={completed}
                  />
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {title}
                </span>
                <button
                  disabled={id === isLoadingId}
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(id)}
                >
                  ×
                </button>
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': isLoadingId === id,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.length - completedTodos.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === Filters.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filters.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === Filters.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filters.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === Filters.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filters.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errors === noErrors },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          onClick={handleHideError}
          className="delete"
        />
        {errors.loadError && 'Unable to load todos'}
        {errors.titleError && 'Title should not be empty'}
        {errors.addTodoError && 'Unable to add a todo'}
        {errors.deleteTodoError && 'Unable to delete a todo'}
      </div>
    </div>
  );
};
