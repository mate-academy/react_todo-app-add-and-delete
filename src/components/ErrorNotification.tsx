import React from 'react';
import classNames from 'classnames';

type Props = {
  setHasError: (value: boolean) => void,
  hasError: boolean,
  errorName: string,
};

export const ErrorNotification: React.FC<Props> = ({
  setHasError,
  hasError,
  errorName,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification',
        'is-danger is-light has-text-weight-normal',
        { hidden: !hasError })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="button"
        onClick={() => setHasError(false)}
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
