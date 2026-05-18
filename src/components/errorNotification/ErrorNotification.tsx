export const ErrorNotification: React.FC<{
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
      {/* Title should not be empty */}
    </div>
  );
};
