import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string | null,
  setErrorMesage: (value: string | null) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMesage,
}) => {
  const [isError, setIsError] = useState(false);

  setTimeout(() => {
    setIsError(true);
    setErrorMesage(null);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: isError,
        })
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="new-field"
        className="delete"
        onClick={() => setIsError(true)}
      />
      {errorMessage}
    </div>
  );
};
