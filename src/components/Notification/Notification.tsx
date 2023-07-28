import cn from 'classnames';
import { useContext, useEffect } from 'react';
import { TodoContext } from '../TodoContext/TodoContext';

export const Notification: React.FC = () => {
  const { error, setError } = useContext(TodoContext);

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  });

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: error.length === 0 },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
