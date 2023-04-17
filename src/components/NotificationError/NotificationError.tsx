/* eslint-disable jsx-a11y/control-has-associated-label */
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
    setTimeout(() => {
      resetError();
    }, 3000);
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
      />

      {error}
    </div>
  );
};

export default NotificationError;
