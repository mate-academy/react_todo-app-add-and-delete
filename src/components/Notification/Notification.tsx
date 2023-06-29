/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  errorType: ErrorType,
  noneError: () => void,
}

export const Notification: React.FC<Props> = ({
  errorType,
  noneError,
}) => {
  const newErrorMessage = () => {
    switch (errorType) {
      case ErrorType.LOAD:
        return 'Failed to load todos';
      case ErrorType.ADD:
        return 'Failed to add todo';

      case ErrorType.DELETE:
        return 'Failed to delete todo';

      case ErrorType.TITLE:
        return 'Title not found';

      default:
        return '';
    }
  };

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: errorType === ErrorType.NONE },
    )}
    >

      <button
        type="button"
        className="delete"
        onClick={noneError}
      />

      {newErrorMessage()}
    </div>
  );
};
