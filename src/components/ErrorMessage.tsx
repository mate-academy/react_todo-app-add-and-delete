/* eslint-disable jsx-a11y/control-has-associated-label */
import { ErrorMessages } from '../types/ErrorMessages';

type Props = {
  errorMessage: ErrorMessages;
  setErrorMessage: (errorMessage:ErrorMessages) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage, setErrorMessage,
}) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessages.EMPTY)}
      />
      {errorMessage}
    </div>

  );
};
