/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingId, setIsLoadingId] = useState<number | null>(null);

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch (error) {
      setIsError(true);
    }
  };

  const handleHideError = () => {
    setIsError(false);
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      setIsLoadingId(-1);
      addTodo(inputValue).then(result => {
        setIsLoadingId(result.id);
        setTodos(prev => [...prev, result]);
        setInputValue('');
        setTimeout(() => setIsLoadingId(null), 500);
      });
    }
  };

  const handleDelete = (id: number) => {
    setIsLoadingId(id);
    try {
      deleteTodo(id).then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setInputValue('');
        setTimeout(() => setIsLoadingId(null), 500);
      });
    } catch (error) {}
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

  const visibleTodos = useMemo(() => {
    return todos;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  // const isAllCompleted = useMemo(() => {
  //   if (completedTodos.length === todos.length) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }, [completedTodos, todos]);

  // const handleToggleAll = () => {

  // };
  // --- for next task

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
                className="filter__link selected"
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className="filter__link"
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className="filter__link"
                data-cy="FilterLinkCompleted"
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

      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          onClick={handleHideError}
          className="delete"
        />
        Unable to load todos
      </div>
    </div>
  );
};
