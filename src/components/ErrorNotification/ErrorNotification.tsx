import cn from 'classnames';

import { Errors } from '../../types/Errors';
import { useTodosContext } from '../../utils/useTodosContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === Errors.default,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Errors.default)}
      />

      {error}
    </div>
  );
};
