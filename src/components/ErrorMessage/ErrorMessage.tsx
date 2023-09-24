import classNames from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (error: string) => void
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage.trim() },
      )}
    >
      <button
        aria-label="error"
        type="button"
        data-cy="HideErrorButton"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
