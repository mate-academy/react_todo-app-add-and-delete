import classNames from 'classnames';
import { useContext, useEffect, useRef } from 'react';
import { TodosContext } from '../../contexts/TodosContext';

export const Notification: React.FC = () => {
  const { error, setError } = useContext(TodosContext);
  const timerID = useRef(0);

  useEffect(() => {
    timerID.current = window.setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timerID.current);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
        aria-label="Hide Error"
      />
      {error}
    </div>
  );
};
