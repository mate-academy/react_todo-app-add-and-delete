import { useEffect, useState } from 'react';
import { ErrorType } from '../../types/Error';
import cn from 'classnames';

interface Props {
  error: ErrorType | null;
}

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }

    const hideError = setTimeout(() => {
      setErrorVisible(false);
    }, 3000);

    return () => {
      clearTimeout(hideError);
    };
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorVisible,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorVisible(false)}
      />
      {error}
    </div>
  );
};
