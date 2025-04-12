import classNames from 'classnames';
type Props = {
  error: string;
  setError: (error: string) => void;
};

const ErrorNotification = ({ error, setError }: Props) => {
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
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};

export default ErrorNotification;
