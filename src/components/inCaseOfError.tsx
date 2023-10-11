import React, { useEffect } from 'react';
import { Errors } from '../types/Errors';

interface Props {
  error: Errors;
  closeError: () => void;
}

export const InCaseOfError: React.FC<Props> = ({ error, closeError }) => {
  useEffect(() => {
    // Set a timeout to call closeError after 3 seconds
    const timeoutId = setTimeout(() => {
      closeError();
    }, 3000);

    // Clean up the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [closeError]);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button type="button" className="delete" onClick={closeError}>
        {error}
      </button>
    </div>
  );
};
