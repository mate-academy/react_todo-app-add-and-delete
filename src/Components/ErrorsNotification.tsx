import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string;
  closeError: (value: string)=>void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  closeError,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        closeError('');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [errorMessage]);

  return (
    <div className={
      classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })
    }
    >

      <button
        type="button"
        className="delete"
        onClick={() => closeError('')}
        aria-label="closeBtn"
      />

      {errorMessage}

    </div>
  );
};
