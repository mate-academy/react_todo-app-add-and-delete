/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { getTodos } from './api/todos';
import * as postService from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoStatus } from './components/TodoStatus';
import { TodoError } from './components/TodoError';
import { TodoItem } from './components/TodoItem';
import { USER_ID } from './api/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [value, setValue] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.Load));
  });

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

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  function addTodo({ userId, title, completed }: Todo): Promise<void> {
    setErrorMessage(Error.None);

    return postService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(Error.Add);
      });
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmiting(true);

    const todoTitle = value.trim();

    const newTodo: Todo = {
      id: todos.length + 1,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    if (!todoTitle) {
      setErrorMessage(Error.EmptyTitle);
      setIsSubmiting(false);
    } else {
      addTodo(newTodo)
        .then(() => setValue(''))
        .finally(() => {
          setTempTodo(null);
          setIsSubmiting(false);
        });
    }
  };

  const onDelete = (todoId: number) => {
    setDeletingIds((ids) => [...ids, todoId]);
    postService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ),
      ))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => setDeletingIds((ids) => ids.filter(id => id !== todoId)));
  };

  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDelete(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
            />
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={isSubmiting}
            />
          </form>
        </header>

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={onDelete}
              deletingIds={deletingIds}
            />

            {tempTodo && (
              <TodoItem
                tempTodo={tempTodo}
                isSubmiting={isSubmiting}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodosCount} items left`}
              </span>

              <TodoStatus
                status={status}
                onStatusChange={setStatus}
              />

              <button
                type="button"
                className={classNames('todoapp__clear-completed', {
                  'todoapp__clear-completed--hidden': !completedTodosCount,
                })}
                onClick={onDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {errorMessage && (
        <TodoError
          error={errorMessage}
          onErrorChange={setErrorMessage}
        />
      )}
    </div>
  );
};
