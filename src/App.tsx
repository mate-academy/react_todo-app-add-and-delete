/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useMemo } from 'react';
import { UserWarning } from './components/UserWarning';
import { getTodos } from './api/todos';
import { AppTodoContext } from './components/AppTodoContext/AppTodoContext';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { Error } from './components/Error/Error';
import { ErrorType } from './components/Error/Error.types';
import { USER_ID } from './react-app-env';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
  } = useContext(AppTodoContext);

  const activeTodos = useMemo(async () => {
    const allTodos = await getTodos(USER_ID);

    return allTodos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const getAllTodos = async () => {
    try {
      const allTodos = await getTodos(USER_ID);

      setTodos(allTodos);
    } catch {
      setErrorMessage(ErrorType.GetAllTodosError);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(ErrorType.NoError);
    }, 3000);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          <NewTodoForm />
        </header>

        {todos.length !== 0 && <TodoList />}

      </div>

      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos} items left`}
        </span>

        <TodoFilter />
      </footer>

      {errorMessage !== ErrorType.NoError && <Error />}
    </div>
  );
};
