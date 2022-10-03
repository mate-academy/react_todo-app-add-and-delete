/* eslint-disable max-len */
import classNames from 'classnames';

type Props = {
  setError: (error: string | null) => void;
  error: string | null;
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
        onClick={() => setError(null)}
        aria-label="no errors"
      />
      {error}
      
    </div>
  );
};
