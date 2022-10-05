import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { TodoContext } from '../../../context/TodoContext';

export const ErrorWindow: React.FC = () => {
  const {
    loadError,
    setLoadError,
    errorMessage,
  } = useContext(TodoContext);

  useEffect(() => {
    const timer = setTimeout(() => setLoadError(false), 3000);

    if (!timer) {
      clearInterval(timer);
    }
  }, [loadError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !loadError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setLoadError(false)}
        aria-label="Close window"
      />

      {errorMessage}
    </div>
  );
};
