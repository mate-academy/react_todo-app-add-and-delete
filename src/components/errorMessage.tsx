import classNames from 'classnames';
import React from 'react';

type Props = {
  error: string | null;
  setError: (errorMesage: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
