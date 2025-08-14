import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onSaveErrorMessage: (errorMessage: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onSaveErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSaveErrorMessage('')}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
