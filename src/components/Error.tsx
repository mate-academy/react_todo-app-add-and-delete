import React, { useState } from 'react';

interface ErrorMessageProps {
  errorMessage: string;
  onClose: () => void;
}

export const Error: React.FC<ErrorMessageProps> = ({
  errorMessage,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (errorMessage && !isVisible) {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        isVisible ? '' : 'hidden'
      }`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClose}
      />
      {errorMessage}
    </div>
  );
};
