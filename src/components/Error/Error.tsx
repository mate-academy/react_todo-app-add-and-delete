/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC } from 'react';
import { ErrorMessage } from '../../types/ErrorEnum';

interface Props {
  hasError: boolean;
  error: ErrorMessage;
  onClose: () => void;
}

const renderSwitch = (err: ErrorMessage) => {
  switch (err) {
    case ErrorMessage.ADD:
      return ErrorMessage.ADD;
    case ErrorMessage.EMPTY:
      return ErrorMessage.EMPTY;
    case ErrorMessage.SERVER:
      return ErrorMessage.SERVER;
    case ErrorMessage.DELETE:
      return ErrorMessage.DELETE;
    default:
      return ErrorMessage.NONE;
  }
};

export const Error: FC<Props> = (
  {
    hasError,
    onClose,
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
        onClick={onClose}
      />
      {renderSwitch(error)}
    </div>
  );
};
