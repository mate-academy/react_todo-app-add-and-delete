import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';

type Props = {
  error: string;
};

export const ErrorNotification:React.FC<Props> = ({ error }) => {
  const [hidden, setHidden] = useState(false);

  const autoHideError = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setHidden(true);
    }, 3000);
  
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  useEffect(() => {
    return autoHideError();
  }, [autoHideError, error]);

  return (
    <div
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHidden(true)}
        aria-label="Close error notification"
      />
      {error}
    </div>
  );
};
