/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC } from 'react';
import { Error } from '../../types/ErrorEnum';

interface ErrorMessageProps {
  hasError: boolean;
  error: Error;
  closeErrorMessage: () => void;
}

const renderSwitch = (err: Error) => {
  switch (err) {
    case Error.ADD:
      return Error.ADD;
    case Error.EMPTY:
      return Error.EMPTY;
    case Error.SERVER:
      return Error.SERVER;
    case Error.DELETE:
      return Error.DELETE;
    default:
      return Error.NONE;
  }
};

export const ErrorMessage: FC<ErrorMessageProps> = (
  {
    hasError,
    closeErrorMessage,
    error,
  },
) => {
  return (
    <div className={
      classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      })
    }
    >
      <button
        type="button"
        className="delete"
        onClick={() => closeErrorMessage()}
      />
      {renderSwitch(error)}
    </div>
  );
};
