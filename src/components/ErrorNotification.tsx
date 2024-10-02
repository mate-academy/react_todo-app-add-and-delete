import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string | null;
  clearErrorMessage: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  clearErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      {
        hidden: !errorMessage,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={clearErrorMessage}
    />
    {errorMessage}
  </div>
);
