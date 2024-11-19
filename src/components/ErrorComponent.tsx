interface ErrorComponentProps {
  error: string | null;
  setError: (error: string | null) => void;
}

export function ErrorComponent({ error, setError }: ErrorComponentProps) {
  return (
    <div
      data-cy={`ErrorNotification`}
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
}
