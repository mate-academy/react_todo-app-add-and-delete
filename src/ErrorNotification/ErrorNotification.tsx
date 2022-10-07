import classNames from 'classnames';
import { Errors } from '../types/Errors';

type Props = {
  setError: (error: Errors | null) => void;
  error: Errors | null;
};

export const ErrorNotification: React.FC<Props> = ({
  setError,
  error,
}) => {
  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !error,
          },
        )
      }
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
