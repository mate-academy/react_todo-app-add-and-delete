import { memo } from 'react';

interface NotificationProps {
  isHidden: boolean,
  setIsHidden: (value: boolean) => void,
  error: string,
}

export const Notification: React.FC<NotificationProps> = memo((
  { isHidden, setIsHidden, error }: NotificationProps,
) => {
  return (
    <div
      className={`notification is-danger is-light has-text-weight-normal ${isHidden ? 'hidden' : ''}`}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {error && <p>{error}</p>}
    </div>
  );
});
