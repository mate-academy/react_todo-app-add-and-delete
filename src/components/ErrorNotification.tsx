interface Props {
  errorMessage: string;
  setError: (value: string) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setError('')}
    />
    {errorMessage}
  </div>
);
