import classNames from 'classnames';

type Props = {
  closeError: (error: boolean) => void;
  error: boolean;
  addingError: (err: boolean) => void;
  errorType: boolean;
};

export const LoadingError: React.FC<Props> = ({
  closeError, error, addingError, errorType,
}) => {
  const handleWindowClose = () => {
    addingError(!errorType);
    closeError(true);
  };

  setTimeout(() => {
    addingError(!errorType);
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
      Unable to load todo list
    </div>
  );
};
