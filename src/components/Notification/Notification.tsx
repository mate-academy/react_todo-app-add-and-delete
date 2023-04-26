import classNames from 'classnames';
import { useState } from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  error: ErrorTypes | null,
};

export const Notification: React.FC<Props> = ({ error }) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isNotificationVisible },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Close notification"
        onClick={() => setIsNotificationVisible(false)}
      />

      {error}
    </div>
  );
};
