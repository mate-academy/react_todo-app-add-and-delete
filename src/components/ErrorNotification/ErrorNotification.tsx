/* eslint-disable jsx-a11y/control-has-associated-label */
import { useCallback, useContext, useEffect } from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../../libs/state';
import { Actions, ErrorMessages } from '../../libs/enums';
import { ERROR_MESSAGE_DELAY } from '../../libs/constants';

export const ErrorNotification = () => {
  const dispatch = useContext(DispatchContext);
  const { errorMessage } = useContext(StateContext);

  const hideErrorMessage = useCallback(() => {
    dispatch({
      type: Actions.setErrorMessage,
      payload: { errorMessage: ErrorMessages.NoError },
    });
  }, [dispatch]);

  const handleHideErrorMessage = () => {
    hideErrorMessage();
  };

  useEffect(() => {
    if (!errorMessage) {
      return () => {};
    }

    const timerId: NodeJS.Timeout = setTimeout(() => {
      hideErrorMessage();
    },
    ERROR_MESSAGE_DELAY);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage, hideErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
