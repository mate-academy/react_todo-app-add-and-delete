import { useContext } from 'react';
import { AppContext } from '../../AppContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useContext(AppContext);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      >
        {' '}
      </button>
      {error}
    </div>
  );
};
