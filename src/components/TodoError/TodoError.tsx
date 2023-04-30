import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string,
  setError: (value: string) => void,
};

export const TodoError: React.FC<Props> = ({ error, setError }) => (
  <div
    className={classNames(
      'notification',
      'is-danger',
      'has-text-weight-normal',
      'is-light',
      {
        hidden: !error,
      },
    )}
  >
    <button
      type="button"
      className="delete"
      onClick={() => setError('')}
      aria-label={error}
    />
    {error}
  </div>
);
