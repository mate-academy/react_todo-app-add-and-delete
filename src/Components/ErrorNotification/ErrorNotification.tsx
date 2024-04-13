import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { Actions, DispatchContext, StateContext } from '../../Store';

export const ErrorNotification: React.FC = () => {
  const { errorLoad } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hideErrorMessage = () => {
    dispatch({
      type: Actions.setErrorLoad,
      payload: '',
    });
  };

  useEffect(() => {
    let timer = 0;

    if (errorLoad) {
      timer = window.setTimeout(() => {
        dispatch({ type: Actions.setErrorLoad, payload: '' });
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [dispatch, errorLoad]);

  return (
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
      {/* Unable to update a todo */}
    </div>
  );
};
