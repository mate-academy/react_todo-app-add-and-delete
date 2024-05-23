import React, { memo, useCallback, useContext, useEffect } from 'react';
import classNames from 'classnames';
import { AppContext } from '../../context/AppContext';

export const ErrorNotification: React.FC = memo(() => {
  const { state, dispatch } = useContext(AppContext);

  const hideErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, [dispatch]);

  const activeError = state.errors.find(error => error.value);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (activeError) {
      timer = setTimeout(() => {
        hideErrors();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [activeError, hideErrors]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !activeError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideErrors}
      />
      {activeError && <div>{activeError.textError}</div>}
    </div>
  );
});

ErrorNotification.displayName = 'ErrorNotification';
