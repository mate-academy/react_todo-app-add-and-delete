import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorMessage: ErrorType | null;
  setErrorMessage: (error: ErrorType | null) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal
  ${!errorMessage && 'hidden'}`}
    >
      <button
        onClick={() => setErrorMessage(null)}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
