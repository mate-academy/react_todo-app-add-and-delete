/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

interface NotificationProps {
  error: string;
}

export const Notification: React.FC<NotificationProps> = ({ error }) => (
  <div className={
    classNames('notification is-danger is-light has-text-weight-normal',
      { hidden: error === '' })
  }
  >
    <button type="button" className="delete" />
    {error}
    <br />
  </div>
);
