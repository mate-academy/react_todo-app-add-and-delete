import { useContext, useEffect } from 'react';
import { DispatchContext, StateContext } from '../../utils/Store';
import classNames from 'classnames';

export const ErrorMessage = () => {
  const { error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const deleteErrorMessage = () => {
    dispatch({
      type: 'setError',
      payload: '',
    });
  };

  useEffect(() => {
    if (error) {
      const timoutId = setTimeout(() => {
        dispatch({
          type: 'setError',
          payload: '',
        });
      }, 3000);

      return () => {
        clearTimeout(timoutId);
      };
    }

    return () => {};
  }, [error, dispatch]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={deleteErrorMessage}
      />
      {error}
    </div>
  );
};
