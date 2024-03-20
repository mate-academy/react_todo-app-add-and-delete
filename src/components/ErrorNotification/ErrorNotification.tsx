import cn from 'classnames';

import { useTodos } from '../../hooks/useTodos';

const ErrorNotification: React.FC = () => {
  const { error, setError } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        aria-label="remove error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};

export default ErrorNotification;
