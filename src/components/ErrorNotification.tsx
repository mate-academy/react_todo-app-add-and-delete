import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (param: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [hiddenError, setHiddenError] = useState(false);

  if (errorMessage) {
    setTimeout(() => setErrorMessage(''), 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: hiddenError,
        },
      )}
    >
      <button
        aria-label="a problem"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHiddenError(prev => !prev)}
      />

      {errorMessage}
    </div>
  );
};
