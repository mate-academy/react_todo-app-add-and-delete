import React, { useEffect } from 'react';
import classnames from 'classnames';

type Props = {
  error: boolean,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames({
        notification: true,
        'is-danger': true,
        'is-light': true,
        'has-text-weight-normal': true,
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="hide-error-button"
      />

      Unable to fetch data
      <br />
    </div>
  );
};
