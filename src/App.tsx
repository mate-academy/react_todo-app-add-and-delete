/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useContext, useEffect } from 'react';

import { DispatchContext, StateContext } from './Store';

import { getTodos } from './api/todos';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { Error } from './types/Error';
import { Todo } from './types/Todo';
import { Filter, FilterTitles } from './types/Filter';

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, filter } = useContext(StateContext);

  const filterTodos = useCallback((
    todosToFilter: Todo[],
    currentFilter: Filter,
  ) => {
    switch (currentFilter.title) {
      case FilterTitles.All:
      default:
        return todosToFilter;

      case FilterTitles.Active:
        return todosToFilter.filter(todo => !todo.completed);

      case FilterTitles.Completed:
        return todosToFilter.filter(todo => todo.completed);
    }
  }, []);

  const handleLoadTodosError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.LoadTodosError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'setError', payload: '' });
    getTodos()
      .then(todosFromServer => {
        dispatch({
          type: 'setTodos',
          payload: todosFromServer,
        });
      })
      .catch(handleLoadTodosError);
  }, [dispatch, handleLoadTodosError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList todos={filterTodos(todos, filter)} />

        {todos.length > 0 && (
          <TodoFooter />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
