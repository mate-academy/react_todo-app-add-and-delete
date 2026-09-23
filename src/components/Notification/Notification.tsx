import classNames from 'classnames';

type Props = {
  notificationText: string;
  onClose: () => void;
};

export const Notification = ({ notificationText, onClose }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !notificationText.length },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {notificationText}
    </div>
  );
};
