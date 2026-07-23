/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';

import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState('');

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const [isLoading, setIsLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    setTimeout(() => {
      newTodoField.current?.focus();
    }, 50);
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

  useEffect(() => {
    focusInput();

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      focusInput();

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsAdding(true);

    addTodo(title)
      .then(todo => {
        setTodos(current => [...current, todo]);

        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);

        focusInput();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todoId));

        focusInput();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(current => current.filter(item => item.id !== todo.id));
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');

            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          }),
      ),
    ).finally(() => {
      focusInput();
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      {isLoading && (
        <div data-cy="TodoLoader" className="loader">
          Loading...
        </div>
      )}

      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              disabled={isAdding}
              onChange={event => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <ul className="todo__list">
                {filteredTodos.map(todo => (
                  <li
                    key={todo.id}
                    data-cy="Todo"
                    className={`todo ${todo.completed ? 'completed' : ''}`}
                  >
                    <div className="view">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={todo.completed}
                        readOnly
                      />

                      <label data-cy="TodoTitle">{todo.title}</label>

                      <button
                        data-cy="TodoDelete"
                        type="button"
                        className="todo__remove"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        ×
                      </button>
                    </div>

                    <div
                      data-cy="TodoLoader"
                      className={`modal overlay ${
                        loadingIds.includes(todo.id) ? 'is-active' : ''
                      }`}
                    >
                      <div
                        className="modal-background
    has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  </li>
                ))}

                {tempTodo && (
                  <li data-cy="Todo" className="todo">
                    <div className="view">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={false}
                        readOnly
                      />

                      <label data-cy="TodoTitle">{tempTodo.title}</label>

                      <button type="button" className="todo__remove">
                        ×
                      </button>
                    </div>

                    <div
                      data-cy="TodoLoader"
                      className="modal overlay is-active"
                    >
   <div className="modal-background
 has-background-white-ter" />

                      <div className="loader" />
                    </div>
                  </li>
                )}
              </ul>
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${
                    filter === 'all' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilter('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={`filter__link ${
                    filter === 'active' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilter('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={`filter__link ${
                    filter === 'completed' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!todos.some(todo => todo.completed)}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
