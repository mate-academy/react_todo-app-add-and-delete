import { useEffect, useState } from 'react';
import classNames from 'classnames';
/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  error: string,
  errorMessage: (value: string) => void
};

export const Error: React.FC<Props> = ({ error, errorMessage }) => {
  const [removeError, setRemoveError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      errorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: removeError,
          },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setRemoveError(true)}
      />
      {error}
    </div>
  );
};
