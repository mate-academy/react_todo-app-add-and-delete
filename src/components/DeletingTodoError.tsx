import classNames from 'classnames';

type Props = {
  closeError: (error: boolean) => void;
  error: boolean;
  setDeleteTodoError: (err: boolean) => void;
};

export const DeletingTodoError: React.FC<Props> = ({
  closeError, error, setDeleteTodoError,
}) => {
  const handleWindowClose = () => {
    setDeleteTodoError(false);
    closeError(true);
  };

  setTimeout(() => {
    setDeleteTodoError(false);
    closeError(true);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: error },
      )}
    >
      <button
        aria-label="Hide Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleWindowClose}
      />
      Unable to delete a todo
    </div>
  );
};
