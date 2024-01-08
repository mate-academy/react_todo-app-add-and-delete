import { Dispatch, SetStateAction } from 'react';
import { ErrorMesage } from '../types/ErrorIMessage';

interface Props {
  errorMessage: ErrorMesage,
  setErrorMessage: Dispatch<SetStateAction<ErrorMesage>>
}

export const Errors: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const handleCloseErrors = () => {
    setErrorMessage(ErrorMesage.noErrors);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="hide error button"
        className={`delete ${!errorMessage && 'hidden'}`}
        onClick={handleCloseErrors}
      />

      {/* show only one message at a time */}
      {errorMessage}
      <br />
    </div>
  );
};
