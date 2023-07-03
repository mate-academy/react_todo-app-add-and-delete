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

      {/* show only one message at a time */}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
