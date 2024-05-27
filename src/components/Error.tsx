import React from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/Context';

export const Error: React.FC = () => {
  const {
    state: { error },
  } = useAppContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};
