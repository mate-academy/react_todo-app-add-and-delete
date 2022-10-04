import classnames from 'classnames';

type Props = {
  error: boolean,
  setError: (boolean:boolean) => void,
  errorText: string
};

export const Errors: React.FC<Props> = ({
  error,
  setError,
  errorText,
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
        aria-label="delete"
        onClick={() => setError(false)}
      />
      {errorText}
    </div>
  );
};
