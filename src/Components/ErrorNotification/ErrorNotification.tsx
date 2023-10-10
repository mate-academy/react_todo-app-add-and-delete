type Props = {
  errorMessage: string;
  setErrorMessage: (newErrorMessage: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={errorMessage
        ? 'notification is-danger is-light has-text-weight-normal'
        : 'notification is-danger is-light has-text-weight-normal hidden'}
    >
      <button
        type="button"
        className="delete"
        aria-label="Clear Error Message"
        onClick={() => setErrorMessage('')}
        data-cy="HideErrorButton"
      />
      {errorMessage}
    </div>
  );
};
