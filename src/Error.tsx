type Props = {
  errorMessage: string,
  setErrorMessage: (newMessage: string) => void;
};

export const Error: React.FC<Props> = ({
  errorMessage,
  setErrorMessage = () => {},
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal
      ${errorMessage ? '' : 'hidden'}`}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
        aria-label="Close error message"
      />
      {errorMessage}
      {}
    </div>
  );
};
