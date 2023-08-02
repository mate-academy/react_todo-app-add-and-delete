/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  hiddenError: boolean,
  setHiddenError: React.Dispatch<React.SetStateAction<boolean>>,
  errorMessage: string,
};

export const ShowError: React.FC<Props> = ({
  hiddenError,
  setHiddenError,
  errorMessage,
}) => {
  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
      hidden={hiddenError}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHiddenError(true)}
      />
      {errorMessage}
    </div>
  );
};
