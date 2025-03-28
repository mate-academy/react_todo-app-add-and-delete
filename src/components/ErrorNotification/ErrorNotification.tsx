import React from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: Errors;
  setErrorMessage: (newErrorMessage: Errors) => void;
  timerId: React.MutableRefObject<number>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
  timerId,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage(Errors.Default);
          window.clearTimeout(timerId.current);
        }}
      />
      {errorMessage}
    </div>
  );
};
