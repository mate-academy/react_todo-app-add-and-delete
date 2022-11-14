import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (param:string) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [hideVisibleError, setHideVisibleError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage, hideVisibleError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: hideVisibleError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="delete"
        className="delete"
        onClick={() => setHideVisibleError(true)}
      />

      { errorMessage }
    </div>
  );
};
