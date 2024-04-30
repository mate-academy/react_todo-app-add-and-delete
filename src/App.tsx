/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useContext } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { DispatchContext } from './store/todoReducer';
import { Action } from './types/actions';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [coverShow, setCoverShow] = useState<number[]>([]);

  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    getTodos()
      .then(response => {
        response.forEach(todo => {
          dispatch({ type: Action.addTodo, payload: todo });
        });
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onError={setErrorMessage} setTempTodo={setTempTodo} />
        <TodoList
          onError={setErrorMessage}
          tempTodo={tempTodo}
          coverShow={coverShow}
          onCoverShow={setCoverShow}
        />
        <Footer onError={setErrorMessage} onCoverShow={setCoverShow} />
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
