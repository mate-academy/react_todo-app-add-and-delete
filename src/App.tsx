/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { Header } from './components/Header';
import { Section } from './components/Section';
import { Footer } from './components/Footer';

import {
  useDispatchContext,
  useStateContext,
} from './components/GlobalStateProvider';

export const App: React.FC = () => {
  const { error } = useStateContext();
  const dispatch = useDispatchContext();

  const handleClearError = React.useCallback(() => {
    dispatch({
      type: 'SET_ERROR',
      payload: '',
    });
  }, [dispatch]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (error) {
      timer = setTimeout(() => {
        handleClearError();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [error, handleClearError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <Section />

        <Footer />
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleClearError}
        />
        {error}
      </div>
    </div>
  );
};
