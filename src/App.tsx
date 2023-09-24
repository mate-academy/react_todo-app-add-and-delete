/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import classNames from 'classnames';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import * as todoService from './api/todos';
import { Status } from './types/Status';
import { USER_ID } from './api/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [visible, setVisible] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [isCompliteDeleting, setIsCompliteDeleting] = useState(false);

  const completedTodosCount = todos.reduce((acc, todo) => {
    return todo.completed ? acc + 1 : acc;
  }, 0);

  const todosCompleted = useMemo(() => todos.filter(
    todo => todo.completed,
  ), [todos]);

  const activeTodosCount = todos.length - completedTodosCount;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      case Status.All:
      default:
        return true;
    }
  });

  const resetAddTodoState = () => {
    setTempoTodo(null);
    setTitle('');
    setDisableInput(false);
  };

  const createTempTodo = () => ({
    id: 0,
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const tempTodo = createTempTodo();

    setTempoTodo(tempTodo);

    setDisableInput(true);

    setTimeout(() => {
      todoService
        .addTodos(tempTodo)
        .then((newTodo) => setTodos([...todos, newTodo]))
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          resetAddTodoState();
          setDisableInput(false);
        });
    }, 500);
  };

  const deleteTodo = (todoId: number) => {
    todoService.deletePost(todoId)
      .then(() => setTodos([
        ...todos.filter(todo => todo.id !== todoId),
      ]))
      .catch(() => setErrorMessage('Unable to delete the todo'));
  };

  const deleteComplitedTodo = async () => {
    if (todosCompleted.length > 0) {
      setIsCompliteDeleting(true);
      try {
        const deletionPromises = todosCompleted.map(
          todo => todoService.deletePost(todo.id),
        );

        await Promise.all(deletionPromises);
        setTodos(todos.filter(todo => !todo.completed));
      } catch (error) {
        setErrorMessage('Unable to delete a todos');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } finally {
        setTimeout(() => setIsCompliteDeleting(false), 3000);
      }
    }
  };

  useEffect(() => {
    if (!disableInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disableInput]);

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 2500);
    }
  }, [errorMessage]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div
        className={classNames('todoapp__content', {
          visible,
        })}
      >
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: completedTodosCount !== 0,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              data-cy="NewTodoField"
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={inputRef}
              disabled={disableInput}
            />
          </form>
        </header>

        {(todos.length > 0 || tempoTodo) && (
          <div
            className={classNames('todo-list', {
              visible,
            })}
          >

            <TodoList
              todos={visibleTodos}
              deleteTodo={deleteTodo}
              tempoTodo={tempoTodo}
              isCompliteDeleting={isCompliteDeleting}
            />

            <footer
              data-cy="Footer"
              className="todoapp__footer"
            >
              <span
                data-cy="TodosCounter"
                className="todo-count"
              >
                {`${activeTodosCount} items left`}
              </span>

              <nav
                data-cy="Filter"
                className="filter"
              >
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: status === Status.All,
                  })}
                  onClick={() => setStatus(Status.All)}
                  data-cy="FilterLinkAll"
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: status === Status.Active,
                  })}
                  onClick={() => setStatus(Status.Active)}
                  data-cy="FilterLinkActive"
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: status === Status.Completed,
                  })}
                  onClick={() => setStatus(Status.Completed)}
                  data-cy="FilterLinkCompleted"
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className={classNames('todoapp__clear-completed', {
                  'todoapp__clear-completed--hidden': completedTodosCount === 0,
                })}
                onClick={deleteComplitedTodo}
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            </footer>
          </div>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={errorMessage
          ? 'notification is-danger is-light has-text-weight-normal'
          : 'notification is-danger is-light has-text-weight-normal hidden'}
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
