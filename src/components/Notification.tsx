import { useState } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface NotificationProps {
  error: string,
}

export const Notification = ({ error }:NotificationProps) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className={`notification is-danger is-light has-text-weight-normal ${isHidden ? 'hidden' : ''}`}>
      <button
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {error}
    </div>
  );
};
