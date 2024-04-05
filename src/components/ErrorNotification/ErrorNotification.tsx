import classNames from 'classnames';

type Props = {
  error: string | null;
  setError: (error: string | null) => void;
};
export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
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
