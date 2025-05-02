import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  handleHiddeErrorMessage: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleHiddeErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage === ErrorMessage.NONE ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHiddeErrorMessage}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
