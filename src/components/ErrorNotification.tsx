import classNames from 'classnames';

type Props = {
  error: string;
  setError: (value: string) => void;
};

export const ErrorNotification = ({ error, setError }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        onClick={() => setError('')}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {error}
    </div>
  );
};
