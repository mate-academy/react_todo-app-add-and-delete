import classNames from 'classnames';
import { Errors } from '../types/Errors';
import React from 'react';

type Props = {
  errorMessage: Errors;
  onClose: (error: Errors) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose(Errors.NONE)}
      />

      {errorMessage}
    </div>
  );
};
