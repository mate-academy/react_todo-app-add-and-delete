interface Props {
  error: string;
  setError: (b: string) => void;
}

export const Errors = ({ error, setError }: Props) => {
  return (
    <div
      hidden={!error}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {/* show only one message at a time */}
      {error === 'load' && (
        <div>
          Unable to load todos
          <br />
        </div>
      )}

      {error === 'empty' && (
        <div>
          Title should not be empty
          <br />
        </div>
      )}

      {error === 'add' && (
        <div>
          Unable to add a todo
          <br />
        </div>
      )}

      {error === 'delete' && (
        <div>
          Unable to delete a todo
          <br />
        </div>
      )}

      {error === 'update' && (
        <div>
          Unable to update a todo
          <br />
        </div>
      )}
    </div>
  );
};
