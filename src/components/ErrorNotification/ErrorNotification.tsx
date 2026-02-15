import React from 'react';
type Props = {
  error: string;
  onErrorDeleat: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onErrorDeleat,
}) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onErrorDeleat()}
        />
        {error}
      </div>
    </>
  );
};
