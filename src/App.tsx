/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { TodoItem } from './components/TodoItem';

enum Errors {
  unableToLoadTodos = 'Unable to load todos',
  unableToDeleteTodo = 'Unable to delete a todo',
  titleShoulNotBeEmpty = 'Title should not be empty',
  unableToAddATodo = 'Unable to add a todo',
}

enum Sort {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState<Sort>(Sort.all);
  const [title, setTitle] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempState, setTempState] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErrorMessage(Errors.unableToLoadTodos));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const handleDelete = (id: number) => {
    setLoadingIds([id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorMessage(Errors.unableToDeleteTodo))
      .finally(() => {
        setLoadingIds([]);
        inputRef.current?.focus();
      });
  };

  const handleCompltete = (id: number) => {
    const completedTodo: Todo[] = todos.map(todo => {
      if (todo.id === id) {
        setLoadingIds([...loadingIds, todo.id]);

        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      setTimeout(() => {
        const loading = loadingIds.filter(item => {
          return item !== todo.id;
        });

        setLoadingIds(loading);
      }, 500);

      return todo;
    });

    setTodos(completedTodo);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage(Errors.titleShoulNotBeEmpty);

      return;
    }

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempState(tempTodo);

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    postTodo(newTodo)
      .then((newTodoFromServer: Todo) => {
        setTodos(currentTodo => [...currentTodo, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.unableToAddATodo))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }

        inputRef.current?.focus();

        setTempState(null);
      });
  };

  const activeTodo = [...todos].filter(todo => todo.completed === false);
  const completedTodo = [...todos].filter(todo => todo.completed === true);

  const handleDeleteCompleted = () => {
    const deletedIds = completedTodo.map(todo => todo.id);

    deletedIds.forEach(id => handleDelete(id));
  };

  let filteredTodos = todos;

  if (sortBy === Sort.active) {
    filteredTodos = activeTodo;
  }

  if (sortBy === Sort.completed) {
    filteredTodos = completedTodo;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
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
              onChange={event => setTitle(event.target.value.trimStart())}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            return (
              <TodoItem
                todo={todo}
                handleCompltete={handleCompltete}
                loadingIds={loadingIds}
                handleDelete={handleDelete}
                key={todo.id}
              />
            );
          })}
          {tempState && (
            <TodoItem
              todo={tempState}
              handleCompltete={handleCompltete}
              loadingIds={[0]}
              handleDelete={handleDelete}
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodo.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: sortBy === Sort.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setSortBy(Sort.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: sortBy === Sort.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSortBy(Sort.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: sortBy === Sort.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSortBy(Sort.completed)}
              >
                Completed
              </a>
            </nav>

            {!completedTodo.length ? (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled
              >
                Clear completed
              </button>
            ) : (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleDeleteCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
