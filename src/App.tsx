import React, { useContext, useEffect } from 'react';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { StateContext, DispatchContext } from './store/TodoContext';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { ActionTypes } from './store/types';
import { ErrorNotification } from './components/Error/ErrorNotification';

export const App: React.FC = () => {
  const { todos, error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (USER_ID) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      getTodos()
        .then(todosFromServer => {
          dispatch({ type: ActionTypes.SET_TODOS, payload: todosFromServer });
        })
        .catch(() => {
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: 'Unable to load todos',
          });
        })
        .finally(() => {
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        });
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch({ type: ActionTypes.SET_ERROR, payload: null });
      }, 3000);
    }
  }, [error, dispatch]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList todos={todos} />
        {todos.length > 0 && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
