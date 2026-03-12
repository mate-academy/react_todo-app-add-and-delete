import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  isHidenError: boolean;
  errorMessage: ErrorMessage;
  setErrorMessage: (message: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  isHidenError,
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isHidenError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.notError)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
