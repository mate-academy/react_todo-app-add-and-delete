type Props = {
  setError: (value: string) => void,
  error: string,
};

export const ErrorNotification: React.FC<Props> = ({ setError, error }) => {
  if (error) {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
        aria-label="HideErrorButton"
      />

      {error}
    </div>
  );
};
