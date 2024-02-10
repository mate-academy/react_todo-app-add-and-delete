/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { ErrorTp } from '../types/error';

type Props = {
  errors: ErrorTp | null;
};

export const Errors: React.FC<Props> = ({ errors }) => {
  const [isVisible, setIsVisible] = useState(true);
  const getError = () => {
    switch (errors) {
      case ErrorTp.add__todo:
        return 'Unable to add a todo';
      case ErrorTp.delete_error:
        return 'Unable to delete a todo';
      case ErrorTp.load_error:
        return 'Unable to load todos';
      case ErrorTp.title_error:
        return 'Title should not be empty';
      case ErrorTp.update_error:
        return 'Unable to update a todo';
      default:
        return null;
    }
  };

  const handleHidden = () => {
    setIsVisible(false);
    // eslint-disable-next-line no-restricted-globals
    close();
  };

  if (errors === null || isVisible) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${isVisible ? 'visible' : 'hidden'}`}
    >
      <button
        aria-label="Close"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHidden}
      />
      {/* show only one message at a time */}
      {getError()}
    </div>
  );
};
