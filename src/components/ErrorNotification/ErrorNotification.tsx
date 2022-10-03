import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (arg: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [isError, setIsError] = useState(false);

  setTimeout(() => setErrorMessage(''), 3000);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isError,
        },
      )}
      data-cy="ErrorNotification"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(true)}
        aria-label="close"
      />
      {errorMessage}
    </div>
  );
};
