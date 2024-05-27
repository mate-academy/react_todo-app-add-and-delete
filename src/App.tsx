import React, { useContext, useEffect, useMemo } from 'react';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Todo } from './types/Todo';
import { SortingTodos } from './types/Sorting';
import { Footer } from './Components/Footer';
import { DispatchContext, TodoContext } from './Components/TodoContext';
import { getTodos } from './api/todos';
import classNames from 'classnames';

export const App: React.FC = () => {
  const { dispatch, resetErrorMessage } = useContext(DispatchContext);
  const { error } = useContext(TodoContext);

  useEffect(() => {
    getTodos()
      .then(data => {
        dispatch({ type: 'setTodos', payload: data });
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: { errorMessage: 'Unable to load todos' },
        });

        resetErrorMessage();
      });
  }, []);

  const { todos, tab } = useContext(TodoContext);

  const filteredTodos = useMemo((): Todo[] => {
    switch (tab) {
      case SortingTodos.completed:
        return todos.filter(t => t.completed);
      case SortingTodos.active:
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }, [todos, tab]);

  const resetErrorMessageOnClick = () => {
    dispatch({ type: 'setError', payload: { errorMessage: '' } });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList todos={filteredTodos} />
        </section>

        {todos.length !== 0 && <Footer />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={resetErrorMessageOnClick}
        />
        {error}
      </div>
    </div>
  );
};
