import cn from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessages: string;
  setErrorMessages: (cond: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessages,
  setErrorMessages,
}) => {
  const handleClose = () => {
    setErrorMessages('');
  };

  useEffect(() => {
    setTimeout(() => setErrorMessages(''), 3000);
  }, [errorMessages, setErrorMessages]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessages,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClose}
        aria-label="Close error notification"
      />

      {errorMessages}
    </div>
  );
};
