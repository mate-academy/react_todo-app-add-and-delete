import classNames from 'classnames';

type Props = {
  errorMessage: string;
  isNotificationHidden: boolean;
  onClose: (value: boolean) => void;
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  isNotificationHidden,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isNotificationHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose(true)}
      />
      {errorMessage}
    </div>
  );
};
