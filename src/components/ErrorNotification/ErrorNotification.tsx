import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  onHideError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onHideError,
}) => {
  return (
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
        onClick={onHideError}
      />
      {/* show only one message at a time */}
      {errorMessage}
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
