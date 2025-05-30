import { ErrorType } from '../types/ErrorType';

interface Props {
  errorMessage: ErrorType | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType | null>>;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`
        notification
        is-danger
        is-light
        has-text-weight-normal
        ${errorMessage === null ? 'hidden' : ''}
        `}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
