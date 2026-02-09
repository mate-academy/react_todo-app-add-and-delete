import classNames from 'classnames';

type TodoErrorsProps = {
  errorMessage: string;
  handleErrorMessage: (text: string) => void;
};

export function TodoErrors({
  errorMessage,
  handleErrorMessage,
}: TodoErrorsProps) {
  const handleDeleteErrorMessage = () => {
    handleErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleDeleteErrorMessage}
      />
      {errorMessage}
    </div>
  );
}

// Unable to load todos

// Title should not be empty

// Unable to add a todo

// Unable to delete a todo

// Unable to update a todo
