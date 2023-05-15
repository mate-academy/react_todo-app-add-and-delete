/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string | null;
  setError: (error: string | null) => void;
};

export const Error: React.FC<Props> = ({
  error,
  setError,
}) => (
  <div className={classNames(
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
    { hidden: !error },
  )}
  >
    <button
      type="button"
      className="delete"
      onClick={() => setError(null)}
    />

    {error}
  </div>
);
