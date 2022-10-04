import classNames from 'classnames';

type Props = {
  error: boolean;
  setError: (error: boolean) => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={() => setError(false)}
      />

      {errorMessage}
    </div>
  );
};
