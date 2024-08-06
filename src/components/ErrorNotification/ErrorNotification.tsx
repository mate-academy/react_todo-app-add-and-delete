import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !errorMessage,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setErrorMessage('')}
    />
    {/* show only one message at a time */}
    {errorMessage}
    {/* <br />
        Unable to update a todo */}
  </div>
);
