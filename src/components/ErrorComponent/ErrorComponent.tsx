/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FC, useEffect } from 'react';

interface Props {
  error: string;
  onChangeError: (error: string) => void;
}

export const ErrorComponent: FC<Props> = React.memo(({
  error,
  onChangeError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      onChangeError('');
    }, 3000);
  }, [error]);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => {
          onChangeError('');
        }}
      />
      {error}
    </div>
  );
});
