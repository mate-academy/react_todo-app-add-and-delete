/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { DispatchContext, StateContext } from '../../TodosContext';
import { ReducerType } from '../../types/enums/ReducerType';

export const Notification: React.FC = () => {
  const { error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    const timeoutId = setTimeout(() => dispatch({
      type: ReducerType.SetError,
      payload: null,
    }), 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, error]);

  const handleButtonDelete = () => dispatch({
    type: ReducerType.SetError,
    payload: null,
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >

      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleButtonDelete}
      />
      {error}
    </div>
  );
};
