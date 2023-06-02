/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useState } from 'react';

interface ErrorProps {
  error:string,
}

export const Error: React.FC<ErrorProps> = ({ error }) => {
  const [message, setMessage] = useState(error);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setMessage(error);
    if (error.length) {
      setIsHidden(false);
    }
  }, [error]);

  return (
    <>
      {message
      && (
        <div className={`notification is-danger is-light has-text-weight-normal ${isHidden ? 'hidden' : ''}`}>
          <button
            type="button"
            className="delete"
            onClick={() => setMessage('')}
          />
          {message}
        </div>
      )}
    </>
  );
};
