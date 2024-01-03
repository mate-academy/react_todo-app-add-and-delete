/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useContext, useEffect } from 'react';
import { Notification } from './components/Notification/Notification';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { DispatchContext, StateContext } from './TodosContext';
import { USER_ID } from './Variables';
import { getTodos } from './api/todos';
import { ReducerType } from './types/enums/ReducerType';
import { Error } from './types/enums/Error';

export const App: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const updateTodos = useCallback(() => {
    getTodos(USER_ID)
      .then((APItodos) => dispatch({
        type: ReducerType.SetTodos,
        payload: APItodos,
      }))
      .catch(() => dispatch({
        type: ReducerType.SetError,
        payload: Error.UnableToLoadTodos,
      }));
  }, [dispatch]);

  useEffect(() => updateTodos(), [updateTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header updateTodos={updateTodos} />

        <TodoList updateTodos={updateTodos} />

        {todos.length !== 0 && (
          <Footer updateTodos={updateTodos} />
        )}
      </div>

      <Notification />
    </div>
  );
};
