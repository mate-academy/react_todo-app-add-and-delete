import classNames from 'classnames';
import { useEffect } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  hasLoadError: string;
  setHasLoadError: (event: string) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  hasLoadError,
  setHasLoadError,
}) => {
  const closeError = () => {
    setHasLoadError('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoadError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasLoadError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: hasLoadError === '' },
      )}
    >

      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />
      {hasLoadError}
    </div>
  );
};
