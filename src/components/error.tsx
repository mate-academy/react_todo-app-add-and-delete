interface ErrorProps {
  error: string | null;
}

export const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error === null ? 'hidden' : ''}`}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};
