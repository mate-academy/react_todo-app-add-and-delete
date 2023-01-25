/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useTodoContext } from '../../store/todoContext';

export const Error = () => {
  const { error, setError } = useTodoContext();

  const [isError, errorMsg] = error;

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError()}
      />
      {errorMsg}
    </div>
  );
};
