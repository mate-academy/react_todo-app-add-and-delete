import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorMessage } from '../types/ErorrMessage';

type Props = {
  errorMessage: ErrorMessage | '';
  onClearMessage: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClearMessage,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      onClearMessage();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, onClearMessage]);

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
        onClick={() => onClearMessage()}
      />
      {errorMessage}
    </div>
  );
};
