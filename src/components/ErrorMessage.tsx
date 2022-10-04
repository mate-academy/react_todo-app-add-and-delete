import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  errorMessage: string,
  setErrorMessage: (param: string) => void,
};

export const ErrorMessage: React.FC<Props> = ({
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
