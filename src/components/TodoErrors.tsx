import cn from 'classnames';
import { useTodosContext } from '../utils/TodosContext';

export const TodosError = () => {
  const { error, setError, messageError } = useTodosContext();

  return (
    <div
      className={cn(
        {
          // eslint-disable-next-line max-len
          'notification is-danger is-light has-text-weight-normal hidden': !error,
          'notification is-danger is-light has-text-weight-normal': error,
        },
      )}
    >
      { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setError(false)}
      />
      {messageError}
    </div>
  );
};
