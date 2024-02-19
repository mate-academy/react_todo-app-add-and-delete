/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  isError: boolean;
  errorMessage: string;
  setIsError: (value: boolean) => void;
};

export const Error: React.FC<Props> = ({
  isError,
  errorMessage,
  setIsError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(false)}
      />
      {/* show only one message at a time */}
      {isError && errorMessage}
    </div>
  );
};

// Unable to load todos
// <br />
// Title should not be empty
// <br />
// Unable to add a todo
// <br />
// Unable to delete a todo
// <br />
// Unable to update a todo
