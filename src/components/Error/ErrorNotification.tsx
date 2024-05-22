import classNames from 'classnames';
import React, { useContext } from 'react';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes } from '../../store/types';

export const ErrorNotification: React.FC = () => {
  const { error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

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
        onClick={() => dispatch({ type: ActionTypes.SET_ERROR, payload: null })}
      />
      {error}
    </div>
  );
};
