type Props = {
  error: string | null;
  hideErrorButton: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  hideErrorButton,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal${error ? '' : ' hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => hideErrorButton}
      />
      {/* show only one message at a time */}
      {error}
    </div>
  );
};
