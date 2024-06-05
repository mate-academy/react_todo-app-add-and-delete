/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addPost, deletePost } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<boolean | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [deletedId, setDeletedId] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const checkError = useCallback((text: string) => {
    setError(text);

    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        checkError('Unable to load todos');
      });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [checkError]);

  const establishFilter = useCallback(
    (
      filterName: FilterType,
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      e.preventDefault();
      e.stopPropagation();

      switch (filterName) {
        case FilterType.ALL: {
          setFilter(null);
          break;
        }

        case FilterType.ACTIVE: {
          setFilter(false);
          break;
        }

        case FilterType.COMPLETED: {
          setFilter(true);
          break;
        }
      }
    },
    [],
  );

  const getFormedTodos = useCallback(
    (todosItems: Todo[]) => {
      if (filter !== null) {
        return todosItems.filter(x => x.completed === filter);
      }

      return todosItems;
    },
    [filter],
  );

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!todoTitle.trim()) {
      checkError('Title should not be empty');

      return;
    }

    const newTodo: Todo = {
      title: todoTitle.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    setTodos(prev => [...prev, newTodo]);

    (inputRef.current as HTMLInputElement).disabled = true;

    addPost(newTodo)
      .then(response => {
        newTodo.id = response.id;

        setTodoTitle('');

        return;
      })
      .catch(() => {
        checkError('Unable to add a todo');
      })
      .finally(() => {
        setTodos(prev => [...prev.filter(x => x.id !== 0)]);
        (inputRef.current as HTMLInputElement).disabled = false;
      })
      .then(() => {
        (inputRef.current as HTMLInputElement).focus();
      });
  };

  const deleteTodo = (id: number) => {
    setDeletedId(id);
    (inputRef.current as HTMLInputElement).disabled = true;

    return deletePost(id)
      .then(() => setTodos(prev => [...prev.filter(x => x.id !== id)]))
      .catch(reject => {
        if (!error) {
          setError('Unable to delete a todo');
        }

        throw reject;
      })
      .finally(() => {
        setDeletedId(0);
        (inputRef.current as HTMLInputElement).disabled = false;
      })
      .then(() => (inputRef.current as HTMLInputElement).focus());
  };

  const deleteAll = () => {
    for (const todo of todos.filter(x => x.completed)) {
      deleteTodo(todo.id);
    }

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
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={e => addTodo(e)}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              value={todoTitle}
              onChange={e => setTodoTitle(e.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <div>
            {todos &&
              getFormedTodos(todos).map((item, index) => (
                <div
                  data-cy={'Todo'}
                  key={'id: ' + index}
                  className={classNames('todo', {
                    completed: item.completed,
                  })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      checked={item.completed}
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {item.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => deleteTodo(item.id)}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active': item.id === 0 || deletedId === item.id,
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              ))}
          </div>
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(x => !x.completed && x.id !== 0).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === null,
                })}
                data-cy="FilterLinkAll"
                onClick={e => establishFilter(FilterType.ALL, e)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === false,
                })}
                data-cy="FilterLinkActive"
                onClick={e => establishFilter(FilterType.ACTIVE, e)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === true,
                })}
                data-cy="FilterLinkCompleted"
                onClick={e => establishFilter(FilterType.COMPLETED, e)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => deleteAll()}
              disabled={todos.find(x => x.completed) === undefined}
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
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
        <br />
        {/* Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
