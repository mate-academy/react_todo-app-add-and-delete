import classNames from 'classnames';

type Props = {
  closeError: (error: boolean) => void;
  error: boolean;
  setAddingBlancError: (err: boolean) => void;
};

export const AddingBlancError: React.FC<Props> = ({
  closeError, error, setAddingBlancError,
}) => {
  const handleWindowClose = () => {
    closeError(true);
    setAddingBlancError(false);
  };

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
      Title can not be empty
    </div>
  );
};
