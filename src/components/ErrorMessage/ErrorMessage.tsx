import React from 'react';
import cn from 'classnames';

type Props = {
  showError: string;
  isHidden: boolean;
  setIsHidden: (status: boolean) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  showError,
  isHidden,
  setIsHidden,
}) => {
  const handleCloseNotification = () => setIsHidden(true);

  return (
    <div className={cn('notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden === true })}
    >
      <button
        aria-label="closeNotification"
        type="button"
        className="delete"
        onClick={handleCloseNotification}
      />

      {showError}
    </div>
  );
};
