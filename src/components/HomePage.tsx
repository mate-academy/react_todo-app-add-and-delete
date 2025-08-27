/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, getTodos, USER_ID } from '../api/todos';
import classNames from 'classnames';
import TodoMain from './TodoMain';
import ErrorNotification from './ErrorNotification';
import { useError } from '../hooks/useError';
import { Errors } from '../types/Error';

function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useError();
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const allCompleted = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError(Errors.FetchError);
      }
    }

    inputRef.current?.focus();
    fetchData();
  }, [setError]);

  function handleDelete(ids: number | number[]) {
    if (Array.isArray(ids)) {
      setTodos(todos.filter(todo => !ids.includes(todo.id)));
    } else {
      setTodos(todos.filter(todo => todo.id !== ids));
    }

    inputRef.current?.focus();
  }

  function handleTodoError(errorMessage: Errors | null) {
    setError(errorMessage);
  }

  function handleLoadingIds(ids: number[]) {
    setLoadingIds(ids);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const title = formData.get('todo') as string;

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setError(Errors.EmptyTitle);

      return;
    }

    try {
      if (inputRef.current) {
        inputRef.current.disabled = true;

        const newTodo: Omit<Todo, 'id'> = {
          title: preparedTitle,
          userId: USER_ID,
          completed: false,
        };

        setTempTodo({
          ...newTodo,
          id: 0,
        });
        handleLoadingIds([0]);
        const data = await addTodo(newTodo);

        inputRef.current.value = '';
        setTodos(prevTodos => [...prevTodos, data]);
      }
    } catch (err) {
      setError(Errors.AddTodo);
    } finally {
      setTempTodo(null);
      inputRef.current!.disabled = false;
      inputRef.current?.focus();
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all hidden', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              name="todo"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
      </div>
      <TodoMain
        todos={todos}
        tempTodo={tempTodo}
        handleDelete={handleDelete}
        handleTodoError={handleTodoError}
        onSetLoading={handleLoadingIds}
        loadingIds={loadingIds}
      />
      <ErrorNotification
        erorrMessage={error}
        clearError={() => setError(null)}
      />
    </div>
  );
}

export default HomePage;
