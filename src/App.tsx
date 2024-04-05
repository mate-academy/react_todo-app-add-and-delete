import React, { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { USER_ID, postTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { useTodosContext } from './context/TodoContext';
import { ErrorList } from './types/ErrorList';

export const App: React.FC = () => {
  const {
    contextInputRef,
    focusInput,
    todos,
    setTodos,
    errorMessage,
    handleError,
    setTempTodo,
  } = useTodosContext();

  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    focusInput();
  }, [isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleQuerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedQuery = query.trim();

    if (!trimedQuery.length) {
      handleError(ErrorList.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newItem = {
      userId: USER_ID,
      title: trimedQuery,
      completed: false,
    };

    setTempTodo({ ...newItem, id: 0 });

    postTodo({ ...newItem })
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setQuery('');
      })
      .catch(() => {
        handleError(ErrorList.AddTodo);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

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

          <form onSubmit={handleQuerySubmit}>
            <input
              ref={contextInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQueryChange}
              disabled={isLoading}
            />
          </form>
        </header>

        <TodoList />

        {!!todos.length && <Footer itemsLeft={itemsLeft} />}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
