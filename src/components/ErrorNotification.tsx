/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  error: ErrorMessage,
  setError: () => void,
}

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => {
  return (
    <div className={classNames('notification is-danger is-light has-text-weight-normal', {
      hidden: !error,
    })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError}
      />

      {error}
    </div>
  );
};
