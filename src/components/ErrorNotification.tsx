import classNames from 'classnames';
import React from 'react';

type Props = {
  error: string;
  setError: (er: string) => void;
};

const ErrorNotificationComponent: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
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

export const ErrorNotification = React.memo(ErrorNotificationComponent);
