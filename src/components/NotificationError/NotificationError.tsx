import {
  FC,
  useEffect,
} from 'react';

import cn from 'classnames';

type Props = {
  error: string;
  resetError: () => void;
};

const NotificationError: FC<Props> = ({ error, resetError }) => {
  useEffect(() => {
    const errorId = setTimeout(() => {
      resetError();
    }, 3000);

    return () => clearTimeout(errorId);
  }, [error]);

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={resetError}
        aria-label="delete"
      />

      {error}
    </div>
  );
};

export default NotificationError;
