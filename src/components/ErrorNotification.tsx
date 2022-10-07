import React from 'react';
import classNames from 'classnames';

type Props = {
  onSetError: (value: boolean) => void,
  error: boolean,
  errorName: string,
};

export const ErrorNotification: React.FC<Props> = ({
  onSetError,
  error,
  errorName,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification',
        'is-danger is-light has-text-weight-normal',
        { hidden: !error })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="button"
        onClick={() => onSetError(false)}
      />
      {errorName}

      {false && (
        <div>
          Unable to delete a todo
          <br />
          Unable to update a todo
        </div>
      )}
    </div>
  );
};
