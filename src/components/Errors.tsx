/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

type Props = {
  errorMsg: string,
  error: boolean,
  setError: (error: boolean) => void,
};

export const Errors: React.FC<Props> = ({ errorMsg, error, setError }) => {
  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(false)}
      />
      {errorMsg}
    </div>
  );
};
