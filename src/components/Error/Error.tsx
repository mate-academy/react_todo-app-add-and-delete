/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import classNames from 'classnames';

type Props = {
  errorMessage: ErrorMessage;
  setErrorMessage: (arg: ErrorMessage) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === ('' as ErrorMessage) },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={e => {
          e.preventDefault();
          setErrorMessage('');
        }}
      />
      {errorMessage}
    </div>
  );
};
