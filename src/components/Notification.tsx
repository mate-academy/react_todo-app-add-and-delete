import classNames from 'classnames';
import { Errors } from '../types/Errors';

type Props = {
  typeError: string | null
  setNotificationError: (notificationError: boolean) => void
  notificationError: boolean;
};

export const Notification: React.FC<Props> = ({
  typeError,
  setNotificationError,
  notificationError,
}) => {
  const { ADD, REMOVE, EMPTY } = Errors;

  if (notificationError) {
    setTimeout(() => {
      setNotificationError(false);
    }, 3000);
  }

  const returnTextError = (value: string | null) => {
    switch (value) {
      case ADD:
        return 'Unable to add a todo';
      case REMOVE:
        return 'Unable to delete a todo';
      case EMPTY:
        return "Title can't be empty";
      default:
        return 'Unable to update a todo';
    }
  };

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !notificationError },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setNotificationError(false);
        }}
      />
      {returnTextError(typeError)}
    </div>
  );
};
