/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Error } from '../../types/Error';

interface Props {
  error: Error
  onErrorMessageChange: (error: Error) => void,
}

export const ErrorNotifications: React.FC<Props> = (
  {
    error,
    onErrorMessageChange,
  },
) => {
  const isHidden = () => {
    return error === Error.None;
  };

  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (!isHidden) {
      timerRef.current = setTimeout(
        () => {
          onErrorMessageChange(Error.None);
        }, 3000,
      );
    } else {
      clearTimeout(timerRef.current);
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal',
          { hidden: isHidden })
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessageChange(Error.None)}
      />
      {!isHidden && (error === Error.NoTodos) ? (error) : `Unable to ${error} a todo`}
    </div>
  );
};
