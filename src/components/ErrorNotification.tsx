import cn from 'classnames';
import { FC, useEffect } from 'react';
import { LoadError } from '../types/LoadError';

interface Props {
  loadError: LoadError,
  setLoadError: React.Dispatch<React.SetStateAction<LoadError>>,
}

export const ErrorNotification:FC<Props> = ({ loadError, setLoadError }) => {
  const disableError = () => {
    setLoadError((current) => ({
      ...current,
      status: false,
    }));
  };

  useEffect(() => {
    setTimeout(disableError, 3000);
  }, []);

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !loadError.status,
      })}
    >
      <button
        aria-label="Close notification"
        type="button"
        className="delete"
        onClick={disableError}
      />

      {loadError.message}
    </div>
  );
};
