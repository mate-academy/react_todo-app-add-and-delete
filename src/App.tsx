/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import cn from 'classnames';
import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Errors } from './types/Errors';
import { Status } from './types/Status';
import { USER_ID } from './variables/UserID';
import { TodoContext } from './context/TodoContext';

export const App: React.FC = () => {
  const {
    title,
    todos,
    filterStatus,
    setFilterStatus,
    setTodos,
    setTempTodo,
    setTitle,
    setErrorMessage,
    setIsInputDisabled,
    isInputDisabled,
  } = useContext(TodoContext);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && !isInputDisabled) {
      titleField.current.focus();
    }
  }, [todos, isInputDisabled]);

  const completedTodos = useMemo(() => {
    return todos.filter((todo) => todo.completed).map((t) => t.id);
  }, [todos]);

  const notCompletedTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const handleDeleteCompletedTodos = useCallback(
    (ids: number[]) => {
      Promise.all(
        ids.map((id) => todoService
          .deleteTodos(id)
          .then(() => id)
          .catch(() => {
            setErrorMessage(Errors.DeleteError);
          })),
      )
        .then((resultIds) => {
          const successfullyDeletedIds = resultIds.filter((id) => id !== null);

          setTodos(prev => prev
            .filter((todo) => !successfullyDeletedIds
              .includes(todo.id)));
        })
        .catch(() => {
          setErrorMessage(Errors.DeleteError);
        });
    },
    [setTodos, setErrorMessage],
  );

  const addNewTodo = async () => {
    const trimmedTitle = title.trim();

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    todoService
      .createTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then((todoFromServer) => {
        setTodos((currentTodos) => [...currentTodos, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(Errors.AddError);
        setTempTodo(null);
      })
      .finally(() => {
        setIsInputDisabled(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Errors.EmptyTitle);
    } else {
      setIsInputDisabled(true);
      addNewTodo();
    }
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
            className={cn('todoapp__toggle-all', {
              active: !!todos.length && todos.every((todo) => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleField}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              disabled={isInputDisabled}
            />
          </form>
        </header>

        <TodoList />

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${notCompletedTodos} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href={Status.All}
                className={cn('filter__link', {
                  selected: filterStatus === Status.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterStatus(Status.All)}
              >
                All
              </a>

              <a
                href={Status.Active}
                className={cn('filter__link', {
                  selected: filterStatus === Status.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterStatus(Status.Active)}
              >
                Active
              </a>

              <a
                href={Status.Completed}
                className={cn('filter__link', {
                  selected: filterStatus === Status.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterStatus(Status.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some((todo) => todo.completed)}
              onClick={() => handleDeleteCompletedTodos(completedTodos)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
