import React, { useContext } from 'react';
import cn from 'classnames';
import { StateContext } from '../context/ContextReducer';

export const TodoAppError: React.FC = () => {
  const { error } = useContext(StateContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn({
        'notification is-danger is-light has-text-weight-normal': error,
        hidden: !error,
      })}
    >
      {error && (
        <button data-cy="HideErrorButton" type="button" className="delete" />
      )}
      {error}
    </div>
  );
};
