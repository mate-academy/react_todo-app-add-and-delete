import { FC } from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  setError: (error: string | null) => void;
}

export const TodoNotification: FC<Props> = ({ error, setError }) => {
  const closeNotification = () => {
    setError(null);
  };

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="close"
        onClick={closeNotification}
      />
      {error}
    </div>
  );
};
