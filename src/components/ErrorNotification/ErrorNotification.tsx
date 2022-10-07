/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorDetected: Error | null;
  setError: (value: null) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorDetected,
  setError,
}) => {
  if (errorDetected) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorDetected },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />

      {errorDetected}
    </div>
  );
};
