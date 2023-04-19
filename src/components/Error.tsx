/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type ErrorProps = {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
};

export const Error: React.FC<ErrorProps> = ({
  errorMessage, setErrorMessage,
}) => {
  const handleCloseNotification = () => {
    setErrorMessage('');
  };

  return (
    <>
      {
        errorMessage && (
          <div
            className="notification is-danger is-light has-text-weight-normal"
          >
            {errorMessage}
            <button
              type="button"
              className="delete"
              onClick={handleCloseNotification}
            />
          </div>
        )
      }
    </>
  );
};
