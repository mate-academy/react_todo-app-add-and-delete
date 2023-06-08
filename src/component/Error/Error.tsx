import React from 'react';

interface Props {
  error: string;
  closeErrorBanner: (value: string) => void;
}

export const Error: React.FC<Props> = ({ error, closeErrorBanner }) => {
  const handlerClick = (value: string) => {
    closeErrorBanner(value);
  };

  return (
    <>
      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <label htmlFor="errorButton">Error:</label>
          <button
            type="button"
            id="errorButton"
            className="delete"
            aria-label="Close"
            onClick={() => handlerClick('')}
          />
          {error}
        </div>
      )}
    </>
  );
};
