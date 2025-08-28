import classNames from 'classnames';
import { Errors } from '../types/Error';

type ErrorProps = {
  erorrMessage: Errors | null;
  clearError: () => void;
};
function ErrorNotification({ erorrMessage, clearError }: ErrorProps) {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !erorrMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {erorrMessage}
    </div>
  );
}

export default ErrorNotification;
