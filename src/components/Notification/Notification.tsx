import classNames from 'classnames';

type Props = {
  errorMessage: string
  onDelete: () => void
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  onDelete,
}) => {
  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        aria-label="delete-button"
        type="button"
        className="delete"
        onClick={onDelete}
      />
      {errorMessage}
    </div>
  );
};
