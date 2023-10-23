import React from 'react';

type Props = {
  error: string,
  setError: (value: string | null) => void,
};

export const ErrorNotify: React.FC<Props> = ({ error, setError }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
