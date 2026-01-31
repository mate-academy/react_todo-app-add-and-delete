import classNames from 'classnames';
import React, { memo } from 'react';

interface Props {
  errorMessage: string;
  handleHideError: () => void;
}

const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleHideError,
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
        onClick={() => handleHideError()}
      />
      {errorMessage}
    </div>
  );
};

export const Error = memo(ErrorNotification);
