import React from 'react';

import cn from 'classnames';

type Props = {
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
};

const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
      data-cy="ErrorNotification"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
