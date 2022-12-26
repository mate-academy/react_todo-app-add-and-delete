import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import { errorMessage } from '../../utils/fetchClient';

type Props = {
  error: ErrorType,
  setError: (value: ErrorType) => void,
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  setError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !error },
    )}
  >
    <button
      data-cy="HideErrorButton"
      aria-label="Close Error"
      type="button"
      className="delete"
      onClick={() => setError('')}
    />
    {errorMessage(error)}
  </div>
);
