import { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../../State/State';

export const Notification = () => {
  const { errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'setError', payload: null });
    }, 3000);
  }, [errorMessage, dispatch]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="hide notification"
      />
      {errorMessage}
    </div>
  );
};
