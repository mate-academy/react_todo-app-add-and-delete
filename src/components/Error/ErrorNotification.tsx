import classNames from 'classnames';
import { Errors } from '../../types/enums/Enums';

interface ErrorProps {
  errorMessage: Errors | null;
  clearErrorMessage: () => void;
}

export const ErrorNotification: React.FC<ErrorProps> = ({
  errorMessage,
  clearErrorMessage,
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
        onClick={() => clearErrorMessage()}
      />
      {errorMessage}
    </div>
  );
};
