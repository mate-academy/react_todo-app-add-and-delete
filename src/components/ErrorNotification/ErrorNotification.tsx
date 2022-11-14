/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  isError: boolean,
  setIsError: (isError: boolean) => void,
  errorMessage: string,
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  setIsError,
  errorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !isError },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => {
        setIsError(false);
      }}
    />
    {errorMessage}
  </div>
);
