import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessages;
  onCloseError: React.Dispatch<React.SetStateAction<ErrorMessages>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onCloseError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        !errorMessage && 'hidden',
      )}
    >
      <button
        onClick={() => onCloseError(ErrorMessages.NoError)}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
