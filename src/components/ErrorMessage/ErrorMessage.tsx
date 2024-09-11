import React from 'react';
import { Errors } from '../../types/Errors';
import classNames from 'classnames';

type Props = {
  errorMessage: Errors | null;
  clear: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ errorMessage, clear }) => {
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
        onClick={clear}
      />
      {errorMessage}
    </div>
  );
};
