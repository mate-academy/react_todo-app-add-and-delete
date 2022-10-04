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
  const clouseError = () => {
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
        onClick={clouseError}
      />
      {hasLoadError}

      <br />
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
