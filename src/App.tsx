/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 10876;
const emptyTodo = {
  id: 0,
  title: '',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [hideError, setHideError] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo]
    = useState<{ id: number, title: string }>(emptyTodo);
  const [loadNewTodo, setLoadNewTodo] = useState<boolean>(false);
  const [deleteTodoId, setDeleteTodoId] = useState<number>();

  const handleErrorMessage = (message: string) => {
    setHideError(false);
    setError(message);

    setTimeout(() => {
      setHideError(true);
    }, 3000);
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const todosFromServer = await postService.getTodos(USER_ID);

        if (!todosFromServer.length) {
          handleErrorMessage('Unable to get todos from server');
        }

        setTodos(todosFromServer);
      };

      fetchData();
    } catch (err) {
      throw new Error();
    }
  }, [todos]);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = {
    all: todos,
    active: activeTodos,
    completed: completedTodos,
  };

  const visibleTodos:Todo[]
    = filteredTodos[filterType as keyof typeof filteredTodos];

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
  };

  const handleErrorDelete = () => setHideError(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) {
      handleErrorMessage('Title can\'t be empty');

      return;
    }

    try {
      const fetchData = async () => {
        const newTodo = await postService.postTodos(USER_ID, query);

        if (!newTodo) {
          handleErrorMessage('Unable to add a todo');
        }

        setTempTodo({
          id: newTodo.id,
          title: newTodo.title,
        });
      };

      setLoadNewTodo(true);
      fetchData();

      if (tempTodo) {
        setTodos(
          todosList => [
            ...todosList,
            {
              id: tempTodo.id,
              userId: USER_ID,
              title: tempTodo.title,
              completed: false,
            },
          ],
        );
        setLoadNewTodo(false);
        setTempTodo(emptyTodo);
        setQuery('');
      }
    } catch (err) {
      throw new Error();
    }
  };

  const handleTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleTodoDelete = (currentId: number) => {
    try {
      const fetchData = async () => {
        const selectedTodo = await postService.deleteTodo(currentId);

        if (!selectedTodo) {
          handleErrorMessage('Unable to delete a todo');
        }
      };

      setDeleteTodoId(currentId);
      fetchData();
    } catch (err) {
      throw new Error();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleTodoInput}
              value={query}
            />
          </form>
        </header>

        {
          todos.length > 0
            && (
              <section className="todoapp__main">
                {visibleTodos.map(todo => (
                  <div
                    className={classNames(
                      'todo',
                      { completed: todo.completed },
                    )}
                    key={todo.id}
                  >
                    <label className="todo__status-label">
                      <input
                        type="checkbox"
                        className="todo__status"
                        checked
                      />
                    </label>

                    <span className="todo__title">{todo.title}</span>

                    <button
                      type="button"
                      className="todo__remove"
                      onClick={() => handleTodoDelete(todo.id)}
                    >
                      ×
                    </button>

                    <div className={classNames(
                      'modal',
                      'overlay',
                      { 'is-active': todo.id === deleteTodoId },
                    )}
                    >
                      <div className="
                        modal-background
                        has-background-white-ter
                        "
                      />
                      <div className="loader" />
                    </div>
                  </div>
                ))}

                {
                  tempTodo.title && loadNewTodo && (
                    <div className="todo">
                      <label className="todo__status-label">
                        <input type="checkbox" className="todo__status" />
                      </label>

                      <span className="todo__title">
                        Todo is being saved now
                      </span>

                      <div className="modal overlay is-active">
                        <div className="
                          modal-background
                          has-background-white-ter
                          "
                        />
                        <div className="loader" />
                      </div>
                    </div>
                  )
                }
              </section>
            )
        }

        {
          todos.length > 0
            && (
              <footer className="todoapp__footer">
                <span className="todo-count">
                  {`${visibleTodos.length} items left`}
                </span>

                <nav className="filter">
                  <a
                    role="button"
                    href="#/"
                    className={classNames(
                      'filter__link',
                      'filter__link__all',
                      { selected: filterType === 'all' },
                    )}
                    onClick={() => handleFilterChange('all')}
                  >
                    All
                  </a>

                  <a
                    href="#/active"
                    className={classNames(
                      'filter__link',
                      'filter__link__active',
                      { selected: filterType === 'active' },
                    )}
                    onClick={() => handleFilterChange('active')}
                  >
                    Active
                  </a>

                  <a
                    href="#/completed"
                    className={classNames(
                      'filter__link',
                      'filter__link__completed',
                      { selected: filterType === 'completed' },
                    )}
                    onClick={() => handleFilterChange('completed')}
                  >
                    Completed
                  </a>
                </nav>

                <button
                  type="button"
                  className={classNames(
                    'todoapp__clear-completed',
                    'clear-completed',
                    {
                      'clear-completed__hide': completedTodos.length === 0,
                    },
                  )}
                >
                  Clear completed
                </button>
              </footer>
            )
        }
      </div>

      <div
        className="
          notification
          is-danger
          is-light
          has-text-weight-normal
        "
        hidden={hideError}
      >
        <button type="button" className="delete" onClick={handleErrorDelete} />
        {error}
      </div>
    </div>
  );
};
