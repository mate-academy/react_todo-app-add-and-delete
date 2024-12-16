type ErrorProps = {
  errorMessage: string | boolean | null;
  onErrorMessage: (value: string | null | boolean) => void;
};

export function Error({ errorMessage, onErrorMessage }: ErrorProps) {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage === null && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage(null)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
}
