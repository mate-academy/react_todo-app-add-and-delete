import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const handleClick = () => setError('');

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error.length === 0 },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClick}
      />
      {error}
    </div>
  );
};
