import classNames from 'classnames';
import { useEffect } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  error: string;
  setError: (error: Errors) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(Errors.NONE);
    }, (3000));

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error === Errors.NONE },
      )}
    >
      <button
        aria-label="hide-Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {error}
    </div>
  );
};
