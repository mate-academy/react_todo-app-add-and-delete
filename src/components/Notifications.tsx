import React, { useEffect } from "react";

interface Props {
  errorMessage: string | null;
  onClose: () => void;
}

export const Notifications: React.FC<Props> = ({ errorMessage, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout(onClose, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        !errorMessage ? "hidden" : ""
      }`}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
