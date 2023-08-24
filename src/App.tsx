/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { createTodos, getTodos, removeTodos } from './api/todos';
import { TodoFilter } from './components/TodoFilter';
import { ErrorType } from './types/ErrorMessage';

const USER_ID = 11356;

function getFilteredTodos(
  todos: Todo[],
  sortBy: string,
) {
  const filteredTodos = todos;

  switch (sortBy) {
    case Status.ALL:
      return filteredTodos;

    case Status.ACTIVE:
      return filteredTodos.filter(todo => todo.completed === false);

    case Status.COMPLETED:
      return filteredTodos.filter(todo => todo.completed === true);

    default:
      return filteredTodos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<string>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorType.None);
  const [isMessageClosed, setIsMessageClosed] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LoadingError);
        setIsMessageClosed(false);
        setTimeout(() => {
          setIsMessageClosed(true);
        }, 3000);
      });
  }, [todos]);

  const filteredTodos = getFilteredTodos(todos, status);
  const itemsLeft = getFilteredTodos(todos, Status.ACTIVE);
  const completedTodos = getFilteredTodos(todos, Status.COMPLETED);

  function addTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(ErrorType.None);
    setIsMessageClosed(false);

    if (newTitle.trim().length === 0) {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    setIsLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });

    createTodos({ userId: USER_ID, title: newTitle, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorType.AddError);
      })
      .finally(() => {
        setNewTitle('');
        setTempTodo(null);
        setIsLoading(false);
      });
  }

  function deleteTodo(event: React.MouseEvent<HTMLButtonElement>, id: number) {
    event.preventDefault();
    setErrorMessage(ErrorType.None);
    setIsMessageClosed(false);

    setIsLoading(true);
    setIsDeleting(curentId => [...curentId, id]);

    removeTodos(id)
      .then(() => {
        setTodos(todos.filter(CurentTodo => id !== CurentTodo.id));
      })
      .catch(() => {
        setErrorMessage(ErrorType.DeleteError);
      })
      .finally(() => {
        setIsLoading(false);
        setIsDeleting([]);
      });
  }

  const ClearCompletedHendlere = (event: React.MouseEvent<HTMLButtonElement>) => {
    todos.map(todo => todo.completed === true && deleteTodo(event, todo.id));
  };

  const inputHendlere = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    setIsMessageClosed(true);
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
            className={classNames('todoapp__toggle-all', {
              active: itemsLeft.length === 0,
            })}
          />
          <form onSubmit={(event) => addTodo(event)}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={inputHendlere}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos.map(todo => (
            <div
              className={classNames('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={(event) => deleteTodo(event, todo.id)}
              >
                ×
              </button>

              <div className={classNames('modal overlay', {
                'is-active': isDeleting.includes(todo.id),
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo !== null && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {
          todos.length > 0 && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${itemsLeft.length} items left`}
              </span>

              <TodoFilter setStatus={setStatus} status={status} />

              {completedTodos.length > 0 && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={(event) => ClearCompletedHendlere(event)}
                >
                  Clear completed
                </button>
              )}

            </footer>
          )
        }
      </div>

      {errorMessage && (
        <div
          className={classNames(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: isMessageClosed,
            },
          )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => {
              setIsMessageClosed(true);
            }}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
