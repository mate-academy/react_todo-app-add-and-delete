import { useContext, useEffect } from 'react';
import * as postService from '../../api/todos';
import { TodosContext } from '../../stor/Context';
import { Main } from '../Main/Main';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import classNames from 'classnames';

export const TodoApp: React.FC = () => {
  const { todos, setTodos, errorMessage, setErrorMessage } =
    useContext(TodosContext);

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      });
  }, [setErrorMessage, setTodos]);

  const isEmpty = todos.length <= 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header isEmpty={isEmpty} />

        {!isEmpty && <Main />}
        {!isEmpty && <Footer />}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
