import cn from 'classnames';
import { Error } from '../utils/Error';

type Props = {
  errorMessage: Error | null;
  showNotification: boolean;
  setShowNotification: (value: boolean) => void;
};

export const Notification: React.FC<Props> = ({
  errorMessage, showNotification, setShowNotification,
}) => {
  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !showNotification,
      })}
    >
      <button
        aria-label="delete notification"
        type="button"
        className="delete"
        onClick={() => setShowNotification(false)}
      />
      {errorMessage}
    </div>
  );
};
