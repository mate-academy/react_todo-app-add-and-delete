/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  error: Error | null;
  setError: (value: null) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />

      {error}
    </div>
  );
};
