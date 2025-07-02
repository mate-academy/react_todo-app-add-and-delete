import classNames from 'classnames';

type Props = {
  error: string;
  setError: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => (
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
    {/* show only one message at a time */}
    {/* Unable to load todos
    <br />
    Title should not be empty
    <br />
    Unable to add a todo
    <br />
    Unable to delete a todo
    <br />
    Unable to update a todo */}
    {error}
  </div>
);
