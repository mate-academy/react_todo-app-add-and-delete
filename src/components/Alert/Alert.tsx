import React, { useState } from 'react';
import cn from 'classnames';
import { ErrorOption } from '../../types/ErrorOption';

export const Alert: React.FC = () => {
  const [hasAlert, setHasAlert] = useState(false);

  const closeAlert = () => {
    setHasAlert(true);

    setTimeout(closeAlert, 3000);
  };

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: hasAlert,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        aria-label="Close"
        className="delete"
        onClick={closeAlert}
      />

      {ErrorOption.ADD}
    </div>
  );
};
