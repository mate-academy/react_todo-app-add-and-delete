/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorMessage } from '../../enum/ErrorMessages';

type Props = {
  error: ErrorMessage | null,
  setError: (status: null) => void;
};

export const Error:React.FC<Props> = ({ error, setError }) => {
  return (
    <>
      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
          {error}
        </div>
      )}
    </>
  );
};
