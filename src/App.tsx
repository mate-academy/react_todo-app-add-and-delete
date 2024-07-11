/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, USER_ID } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { useDispatch } from './GlobalStateProvider';
import { Type } from './types/Action';
import { ErrorNotifications } from './components/ErrorNotifications';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';

export const App: React.FC = () => {
  const dispatch = useDispatch();

  const handleError = (message: string) => {
    dispatch({
      type: Type.setErrorMessage,
      payload: message,
    });
    setTimeout(
      () => dispatch({ type: Type.setErrorMessage, payload: '' }),
      3000,
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    dispatch({ type: Type.setLoading, payload: true });

    getTodos()
      .then(response => dispatch({ type: Type.setTodos, payload: response }))
      .catch(() => {
        handleError(ErrorType.LOAD_TODOS);
      })
      .finally(() => dispatch({ type: Type.setLoading, payload: false }));
  }, []);

  const deleteTodosFromServer = (item: Todo) => {
    dispatch({ type: Type.setErrorMessage, payload: '' });
    dispatch({ type: Type.setIsSubmitting, payload: true });

    return deleteTodos(item.id)
      .then(() => dispatch({ type: Type.DeleteTodo, payload: item }))
      .catch(() => handleError(ErrorType.DELETE_TODO))
      .finally(() => {
        dispatch({ type: Type.resetDeletedTodos, payload: item });
        dispatch({ type: Type.setIsSubmitting, payload: false });
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header handleError={handleError} />
        <TodoList deleteTodosFromServer={deleteTodosFromServer} />
        <Footer deleteTodosFromServer={deleteTodosFromServer} />
      </div>
      <ErrorNotifications />
    </div>
  );
};
