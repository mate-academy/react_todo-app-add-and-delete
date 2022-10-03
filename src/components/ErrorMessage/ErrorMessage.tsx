import classnames from 'classnames';

type Props = {
  error: boolean;
  handleError: (value: boolean) => void;
  errorMessage: string;
};

export const ErrorMessage: React.FC<Props> = ({
  error,
  handleError,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide Error"
        onClick={() => handleError(false)}
      />
      {errorMessage}
    </div>
  );
};
