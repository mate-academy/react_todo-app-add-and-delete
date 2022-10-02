import classNames from 'classnames';

type Props = {
  closeError: (error: boolean) => void;
  error: boolean;
  setAddTodoError: (err: boolean) => void;
};

export const AddingTodoError: React.FC<Props> = ({
  closeError, error, setAddTodoError,
}) => {
  const handleWindowClose = () => {
    setAddTodoError(false);
    closeError(true);
  };

  setTimeout(() => {
    setAddTodoError(false);
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
      Unable to add a todo
    </div>
  );
};
