import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';
import React from 'react';

type Props = {
  errorMessage: ErrorMessage | null;
  onHideErrorButtonClick: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onHideErrorButtonClick,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideErrorButtonClick}
      />

      {errorMessage}
    </div>
  );
};
