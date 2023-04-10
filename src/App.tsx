/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorList } from './components/ErrorList/ErrorList';
import {
  TodoFilter,
  FilterTodoStatus,
} from './components/TodoFilter/TodoFilter';
import { TodoForm, TodoFormProps } from './components/TodoForm/TodoForm';

import { ErrorTypes } from './types/ErrorTypes';

const USER_ID = 6848;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filter, setFilter] = useState<FilterTodoStatus>(FilterTodoStatus.ALL);
  const [errors, setErrors] = useState<string>('');
  const [deletedTodosIds, setDeletedTodosIds] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((result) => setTodos(result))
      .catch(() => setErrors(ErrorTypes.Load));
  }, []);

  const activeTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some((todo) => todo.completed),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    return filter === FilterTodoStatus.ALL
      ? todos
      : todos.filter((todo) => {
        switch (filter) {
          case FilterTodoStatus.ACTIVE:
            return !todo.completed;

          case FilterTodoStatus.COMPLETED:
            return todo.completed;

          default:
            return true;
        }
      });
  }, [todos, filter]);

  const handleSuccess = useCallback<TodoFormProps['onSuccess']>((todo) => {
    setTodos((prevTodos) => [...prevTodos, todo]);
    setTempTodo(null);
  }, []);

  const handleErrorAdd = useCallback<TodoFormProps['onError']>(
    (errorMessage: string) => {
      setTempTodo(null);

      setErrors(errorMessage);
    },
    [],
  );

  const handleTempTodo = useCallback<TodoFormProps['onTempTodo']>((todo) => {
    setTempTodo(todo);
  }, []);

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setDeletedTodosIds((prevState) => [...prevState, todoId]);
      const response = await deleteTodo(todoId);

      if (response === 0) {
        throw new Error(ErrorTypes.Delete);
      }

      const newTodos = todos.filter((todo) => todo.id !== todoId);

      setTodos([...newTodos]);
    } catch {
      setErrors(ErrorTypes.Delete);
    } finally {
      setDeletedTodosIds(
        deletedTodosIds.filter((deletedTodoId) => deletedTodoId !== todoId),
      );
    }
  };

  const resetErrorHandler = useCallback(() => {
    setErrors('');
  }, []);

  const handleClearCompleted = async () => {
    const tasks = todos
    .filter((todo) => todo.completed)
    .map((todo) => handleDeleteTodo(todo.id));

    await Promise.all(tasks);

    const result = todos.filter((todo) => !todo.completed);

    setTodos([...result]);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />
          <TodoForm
            userId={USER_ID}
            onError={handleErrorAdd}
            onSuccess={handleSuccess}
            onTempTodo={handleTempTodo}
          />
        </header>

        {!!todos.length && (
          <>
            <section className="todoapp__main">
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                deleteTodo={handleDeleteTodo}
                deletedTodos={deletedTodosIds}
              />
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodos.length} items left`}
              </span>

              <TodoFilter filter={filter} onFilterChange={setFilter} />

              {hasCompletedTodos && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <ErrorList errors={errors} onClear={resetErrorHandler} />
    </div>
  );
};
