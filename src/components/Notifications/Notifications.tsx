/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

interface Props {
  error: string | null;
  handleCloseError: () => void;
}

export const Notifications: React.FC<Props> = ({ error, handleCloseError }) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseError}
      />
      {error}
    </div>
  );
};
