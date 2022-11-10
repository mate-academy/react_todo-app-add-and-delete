import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  manageErrors: (errorType: ErrorType) => void;
  errorMessage: string;
};

export const ErrorMessages: React.FC<Props> = ({
  manageErrors,
  errorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: errorMessage === ErrorType.None,
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      aria-label="delete"
      onClick={() => manageErrors(ErrorType.None)}
    />

    {errorMessage}
  </div>
);
