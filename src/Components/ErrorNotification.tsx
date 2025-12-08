import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage?: string;
  onReset: () => void;
};

const ErrorNotificationComponent: React.FC<Props> = ({
  errorMessage = '',
  onReset,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        errorMessage ? '' : 'hidden',
      )}
    >
      <button
        onClick={onReset}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
      {/* show only one message at a time */}
      {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
    </div>
  );
};

export const ErrorNotification = React.memo(ErrorNotificationComponent);
