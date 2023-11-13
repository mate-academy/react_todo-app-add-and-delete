type Props = {
  errorMesssage: string,
  setErrorMesssage: (val: string) => void
};

export const ErrorNotification: React.FC<Props> = ({
  errorMesssage,
  setErrorMesssage,
}) => {
  if (errorMesssage) {
    setTimeout(() => setErrorMesssage(''), 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMesssage.length === 0 ? 'hidden' : ''}`}
    >
      <button
        aria-label="error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMesssage('')}
      />
      {errorMesssage}
    </div>
  );
};
