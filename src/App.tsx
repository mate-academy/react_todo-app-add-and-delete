/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 10876;
const emptyTodo = {
  userId: 0,
  id: 0,
  title: '',
  completed: false,
};

enum Filter {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Filter>(Filter.all);
  const [isHideError, setIsHideError] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo>(emptyTodo);
  const [isTodoLoaded, setIsTodoLoaded] = useState<boolean>(false);
  const [deleteTodoIds, setDeleteTodoIds] = useState([0]);

  const handleErrorMessage = (message: string) => {
    setIsHideError(false);
    setError(message);

    setTimeout(() => {
      setIsHideError(true);
    }, 3000);
  };

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then((todosFromServer: Todo[]) => setTodos(todosFromServer))
      .catch(() => setError('Unable to get todos'));
  }, []);

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

  const visibleTodos:Todo[] = filteredTodos[
    filterType as keyof typeof filteredTodos
  ];

  const handleFilterChange = (selectedFilter: Filter) => {
    setFilterType(selectedFilter);
  };

  const handleErrorDelete = () => setIsHideError(true);

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setIsTodoLoaded(true);
      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await postService.postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      handleErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(emptyTodo);
      setIsTodoLoaded(false);
      setQuery('');
    }
  };

  const handleTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const deleteTodo = async (currentId: number) => {
    try {
      setDeleteTodoIds(prevIds => [...prevIds, currentId]);
      await postService.deleteTodo(currentId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== currentId));
    } catch {
      handleErrorMessage('Unable to delete a todo');
    } finally {
      setTempTodo(emptyTodo);
    }
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={() => addTodo(query)}>
            <input
              type="text"
              className={classNames(
                'todoapp__new-todo',
                { 'todoapp__new-todo__load': isTodoLoaded },
              )}
              placeholder="What needs to be done?"
              onChange={handleTodoInput}
              value={query}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main">
            {visibleTodos.map(todo => {
              const { id, title, completed } = todo;

              return (
                <div
                  className={classNames(
                    'todo', { completed },
                  )}
                  key={id}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status"
                      checked
                    />
                  </label>

                  <span className="todo__title">{title}</span>

                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => deleteTodo(id)}
                  >
                    ×
                  </button>

                  <div className={classNames(
                    'modal',
                    'overlay',
                    { 'is-active': deleteTodoIds.includes(id) },
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
              );
            })}

            {tempTodo.title && isTodoLoaded && (
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
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${visibleTodos.length} ${visibleTodos.length > 1 ? 'items' : 'item'} left`}
            </span>

            <nav className="filter">
              <a
                role="button"
                href="#/"
                className={classNames(
                  'filter__link',
                  'filter__link__all',
                  { selected: filterType === Filter.all },
                )}
                onClick={() => handleFilterChange(Filter.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  'filter__link__active',
                  { selected: filterType === Filter.active },
                )}
                onClick={() => handleFilterChange(Filter.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  'filter__link__completed',
                  { selected: filterType === Filter.completed },
                )}
                onClick={() => handleFilterChange(Filter.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className={classNames(
                'todoapp__clear-completed',
                'clear-completed',
                { 'clear-completed__hide': completedTodos.length === 0 },
              )}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className="
          notification
          is-danger
          is-light
          has-text-weight-normal
        "
        hidden={isHideError}
      >
        <button type="button" className="delete" onClick={handleErrorDelete} />
        {error}
      </div>
    </div>
  );
};
