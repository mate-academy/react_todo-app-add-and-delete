import React, { useState, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
};

export const Alert: React.FC<Props> = ({ errorMessage }) => {
  const [hasAlert, setHasAlert] = useState(false);

  const closeAlert = () => {
    setHasAlert(true);
  };

  useEffect(() => {
    const timerID = setTimeout(closeAlert, 3000);

    return () => clearTimeout(timerID);
  }, []);

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
      <button
        type="button"
        aria-label="Close"
        className="delete"
        onClick={closeAlert}
      />

      {errorMessage}
    </div>
  );
};
