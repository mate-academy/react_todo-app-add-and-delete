import classNames from 'classnames';
import React from 'react';

import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  message: string;
  setErrorMessage: (message: ErrorMessages) => void;
};

export const Error: React.FC<Props> = ({ message, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: message === ErrorMessages.NoError },
      )}
    >
      {message}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessages.NoError)}
      />
    </div>
  );
};
