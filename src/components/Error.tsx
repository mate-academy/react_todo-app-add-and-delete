import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessages';

interface Props {
  errorMessage: ErrorMessage;
  setErrorMessage: (error: ErrorMessage) => void;
}

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  return (
    // {/* DON'T use conditional rendering to hide the notification */ }
    // {/* Add the 'hidden' class to hide the message smoothly */}
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
        onClick={() => setErrorMessage(ErrorMessage.NoError)}
      />
      {/* show only one message at a time */}
      {/* Unable to load todos */}

      {errorMessage}

      {/* Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
    </div>
  );
};
