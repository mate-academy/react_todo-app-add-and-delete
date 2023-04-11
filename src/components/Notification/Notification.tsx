import classNames from 'classnames';

type Props = {
  isError: string
  onChangeStatus: (hidden: boolean) => void
  isHiddenNotification: boolean
};

export const Notification: React.FC<Props> = ({
  isError,
  isHiddenNotification,
  onChangeStatus,
}) => {
  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isHiddenNotification },
      )}
    >
      <button
        aria-label="delete-button"
        type="button"
        className="delete"
        onClick={() => onChangeStatus(true)}
      />
      {isError}
    </div>
  );
};
