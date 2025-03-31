import classNames from 'classnames';
import { ErrorType } from '../../types/Error';

type Props = {
  errorMessage: ErrorType;
  clearErrorMessage: () => void;
};

export const Error: React.FC<Props> = ({ errorMessage, clearErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
      hidden={!errorMessage}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
