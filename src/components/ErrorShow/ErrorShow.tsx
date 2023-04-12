import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import './ErrorHide.scss';

interface Props {
  errorToShow: ErrorType;
  hideError: () => void;
}

enum ErrorMessage {
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
  none = '',
  emptyTitle = 'Title can\'t be empty',
}

export const ErrorShow: React.FC<Props> = ({
  errorToShow,
  hideError,
}) => {
  const handleHideError = () => {
    hideError();
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        'hidden',
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      { ErrorMessage[errorToShow] }
    </div>
  );
};
