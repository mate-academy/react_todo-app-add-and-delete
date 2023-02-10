import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  error: string;
  setError: (v: ErrorMessages | null) => void;
};

export const Errors: React.FC<Props> = ({ error, setError }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
      setError(null);
    }, 3000);
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
          )}
        >
          <button
            type="button"
            className="delete"
            aria-label="Close error"
            onClick={() => {
              setIsVisible(false);
            }}
          />

          {error}
        </div>
      )}
    </>
  );
};
