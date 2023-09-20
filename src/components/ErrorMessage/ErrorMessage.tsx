import React, { useState } from 'react';
import classNames from 'classnames';

interface Props {
  error: string
}
export const ErrorMessage: React.FC<Props> = ({ error }) => {
  const [isErrorHiden, setIsErrorHiden] = useState(true);

  const handleErrorClose = () => {
    setIsErrorHiden(true);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isErrorHiden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleErrorClose}
        aria-label="Delete"
      />
      {error}
    </div>
  );
};
