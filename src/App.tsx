/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { Actions, DispatchContext, StateContext } from './Store';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import classNames from 'classnames';
import { Footer } from './Components/Footer/Footer';
import { wait } from './utils/fetchClient';

export const App: React.FC = () => {
  const { errorLoad } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hideErrorMessage = () => {
    dispatch({
      type: Actions.setErrorLoad,
      payload: '',
    });
  };

  wait(3000).then(() => {
    if (errorLoad) {
      dispatch({
        type: Actions.setErrorLoad,
        payload: '',
      });
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList />
        <Footer />
      </div>

      {/* DON'T use conditional rendering to hide the notification + */}
      {/* Add the 'hidden' class to hide the message smoothly +*/}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorLoad,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideErrorMessage}
        />
        {/* show only one message at a time +*/}
        {errorLoad}
        {/* <br /> */}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
