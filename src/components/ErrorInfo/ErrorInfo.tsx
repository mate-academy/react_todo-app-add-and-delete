/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoError } from '../../types/TodoFilter';

type Error = {
  errorType: TodoError
  errorButtonHandler: () => void
};

export const ErrorInfo: React.FC<Error> = ({
  errorType,
  errorButtonHandler,
}) => {
  return (
    <>
      {errorType !== TodoError.noerror && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={errorButtonHandler}
          />
          {errorType}
        </div>
      )}
    </>
  );
};
