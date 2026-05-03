import classNames from 'classnames';
import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  error: ErrorMessage;
  onDeleteMessage: (message: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onDeleteMessage,
}) => {
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
        onClick={() => onDeleteMessage(ErrorMessage.None)}
      />
      {error}
    </div>
  );
};
