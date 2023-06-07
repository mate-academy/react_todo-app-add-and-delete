/* eslint-disable jsx-a11y/control-has-associated-label */
import { ActionError } from '../types/ActionError';

interface NotificationProps {
  message: ActionError | string
}

export const Notification = ({ message }: NotificationProps) => {
  const className = `notification is-danger is-light has-text-weight-normal' ${message ? '' : 'hidden'}`;

  return (
    <div className={className}>
      <button type="button" className="delete" />
      {message}
      <br />
    </div>
  );
};
