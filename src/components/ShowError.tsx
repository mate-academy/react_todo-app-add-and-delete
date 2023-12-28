/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { TodoError } from '../types/TodoError';

type Props = {
  errorMessage: TodoError;
  isShowError: boolean;
  setIsShowError: (value: boolean) => void;
};

export const ShowError: React.FC<Props> = ({
  errorMessage,
  isShowError,
  setIsShowError,
}) => {
  setTimeout(() => {
    setIsShowError(false);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !isShowError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsShowError(false)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
