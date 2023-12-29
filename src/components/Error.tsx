import { useEffect } from 'react';
import classNames from 'classnames';
import { useTodos } from '../context/TodosProvider';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage, setErrorMessage]);

  return (
    // {/* Notification is shown in case of any error */}
    // {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="hide error button"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
