/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { useTodoContext } from './context';
import { Errors } from './types/Errors';
import { Header } from './components/Header';
import { ErrorAlert } from './components/ErrorAlert';

export const App: React.FC = () => {
  const {
    setAllTodos,
    errorHandler,
    inputRef,
    tempTodo,
    USER_ID,
  } = useTodoContext();

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await getTodos(USER_ID);

        setAllTodos(todos);
      } catch (error) {
        errorHandler(Errors.loadError);
      }
    };

    loadTodos();
  }, [setAllTodos, errorHandler, USER_ID]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, inputRef]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList />
        </section>
      </div>
      <ErrorAlert />
    </div>
  );
};
