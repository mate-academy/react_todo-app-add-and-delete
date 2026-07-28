import React from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => (
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
      onClick={() => setErrorMessage('')}
    />
    {errorMessage}
  </div>
);
