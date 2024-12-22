import React, { useEffect, useRef } from 'react';

interface Props {
  errorMessage: string;
  onErrorMessage: (v: string) => void;
}

export const MyError: React.FC<Props> = ({ errorMessage, onErrorMessage }) => {
  const errorDiv = useRef<HTMLDivElement | null>(null);
  const timerId = useRef(0);

  useEffect(() => {
    if (errorDiv.current && errorMessage) {
      errorDiv.current.classList.remove('hidden');
      window.clearTimeout(timerId.current);
      timerId.current = window.setTimeout(() => {
        errorDiv.current?.classList.add('hidden');
        onErrorMessage('');
      }, 3000);
    }
  }, [errorMessage, onErrorMessage]);

  const closeError = () => {
    window.clearTimeout(timerId.current);
    errorDiv.current?.classList.add('hidden');
  };

  return (
    <div
      ref={errorDiv}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal hidden"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
