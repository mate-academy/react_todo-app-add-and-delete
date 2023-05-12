/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FC } from 'react';

interface Props {
  error: string;
  setError: (error: string) => void;
}

export const ErrorComponent: FC<Props> = React.memo(({
  error,
  setError,
}) => {
  setTimeout(() => {
    setError('');
  }, 3000);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => {
          setError('');
        }}
      />
      {error}
      {/* 'Unable to update a todo' */}
    </div>
  );
});
