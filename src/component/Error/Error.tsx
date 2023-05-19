/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

interface Props {
  error: string,
  onClose: () => void,
}

export const Error: React.FC<Props> = ({
  error,
  onClose: handleCloseError,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      },
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
