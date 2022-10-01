/* eslint-disable max-len */
import classNames from 'classnames';

type Props = {
  setError: (error: boolean) => void;
  error: boolean;
};

export const ErrorNotification: React.FC<Props> = ({ setError, error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification is-danger is-light has-text-weight-normal', {
        'notification is-danger is-light has-text-weight-normal hidden': !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(false)}
        aria-label="no errors"
      />

      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo
    </div>
  );
};
