/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTypes';
import { Error } from './types/Error';
import { getTodos } from './api/todos';
import * as postService from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/FilterTodo';
import { TodoError } from './components/TodoError';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11217;

const getVisibleTodos = (todos: Todo[], status: FilterType) => {
  return todos.filter(todo => {
    switch (status) {
      case FilterType.Completed:
        return todo.completed;

      case FilterType.Active:
        return !todo.completed;

      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [query, setQuery] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.Load));
  });

  const visibleTodos = useMemo(() => getVisibleTodos(todos, status),
    [todos, status]);

  const todosCount = useMemo(() => todos.filter(todo => !todo.completed).length,
    [todos]);

  const isCompletedTodos = useMemo(() => todos.some(todo => todo.completed),
    [todos]);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  function addTodo({ userId, title, completed }: Todo): Promise<void> {
    setErrorMessage(Error.None);

    return postService.createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(Error.Add);
        throw error;
      });
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmiting(true);

    const newTodo: Todo = {
      id: todos.length + 1,
      title: query,
      completed: false,
      userId: USER_ID,
    };

    if (query.length === 0) {
      setErrorMessage(Error.EmptyTitle);
    } else {
      addTodo(newTodo)
        .then(() => setQuery(''))
        .finally(() => {
          setTempTodo(null);
          setIsSubmiting(false);
        });
    }

    setTempTodo({ ...newTodo });
  };

  const onDeleteTodo = (todoId: number) => {
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
      onDeleteTodo(todo.id);
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
              value={query}
              onChange={handleQuery}
              disabled={isSubmiting}
            />
          </form>
        </header>

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
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
                {`${todosCount} items left`}
              </span>

              <TodoFilter
                status={status}
                onStatusChange={setStatus}
              />

              <button
                type="button"
                className={classNames(
                  'todoapp__clear-completed',
                  { 'todoapp__clear-completed--disabled': !isCompletedTodos },
                )}
                onClick={onDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {
        errorMessage && (
          <TodoError
            error={errorMessage}
            onErrorChange={setErrorMessage}
          />
        )
      }
    </div>
  );
};
