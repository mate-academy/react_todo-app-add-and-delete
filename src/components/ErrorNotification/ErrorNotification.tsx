type Props = {
  errorText: string;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorText,
  setErrorText,
}) => {
  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!errorText}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorText('')}
      >
        {}
      </button>
      {errorText}
    </div>
  );
};
