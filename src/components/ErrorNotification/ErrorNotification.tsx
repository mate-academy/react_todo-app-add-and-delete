import classNames from 'classnames';
import { Errors } from '../../enums/Errors';
import { useTodosContext } from '../../hooks/useTodosContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === Errors.Default },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Errors.Default)}
      />
      {error}
    </div>
  );
};
