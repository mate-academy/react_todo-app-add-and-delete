import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  const [displayedMessage, setDisplayedMessage] = useState(errorMessage);

  useEffect(() => {
    if (errorMessage) {
      setDisplayedMessage(errorMessage);
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
      {displayedMessage}
    </div>
  );
};
