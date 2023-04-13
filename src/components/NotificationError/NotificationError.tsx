/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useEffect,
  useRef,
} from 'react';

import cn from 'classnames';

type Props = {
  error: string;
  resetError: () => void;
};

const NotificationError: FC<Props> = ({ error, resetError }) => {
  const errorElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      errorElement.current?.classList.add('hidden');
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
      ref={errorElement}
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
