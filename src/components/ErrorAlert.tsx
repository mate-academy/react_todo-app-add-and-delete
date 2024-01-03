import classNames from 'classnames';
import { useTodoContext } from '../context';

export const ErrorAlert = () => {
  const {
    errorMessage,
    setErrorMessage,
  } = useTodoContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={() => setErrorMessage(null)}
      />
      <span>{errorMessage}</span>
    </div>
  );
};
