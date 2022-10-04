import { Error } from '../../types/Error';

type Props = {
  handleError: (value: Error | null) => void;
  errorMessage: Error | null;
};

export const ErrorMessage: React.FC<Props> = ({
  handleError,
  errorMessage,
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
        aria-label="Hide Error"
        onClick={() => handleError(null)}
      />
      {errorMessage}
    </div>
  );
};
