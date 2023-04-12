/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const deleteError = () => {
    setErrorMessage('');
  };

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        onClick={deleteError}

      />

      {errorMessage}
    </div>
  );
};
