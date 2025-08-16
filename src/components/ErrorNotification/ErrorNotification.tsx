import { ErrorMessage } from '../../types/ErrorMessage';
import classNames from 'classnames';

interface Props {
  errorMessage: ErrorMessage;
  hideError: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  hideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {errorMessage}
    </div>
  );
};

export * from './ErrorNotification';
