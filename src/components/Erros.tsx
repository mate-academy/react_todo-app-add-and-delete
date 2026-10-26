import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  const [messageToDisplay, setMessageToDisplay] = useState(errorMessage);

  useEffect(() => {
    if (errorMessage) {
      setMessageToDisplay(errorMessage);
    }
  }, [errorMessage]);

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
        onClick={onClose}
      />
      {messageToDisplay}
    </div>
  );
};
