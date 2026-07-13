import classNames from 'classnames';

interface ErrorProps {
  error: string;
  setError: (cathcError: string) => void;
}

export const ErrorNotification = ({ error, setError }: ErrorProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        `notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`,
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {/* show only one message at a time */}
      {error}
    </div>
  );
};
