/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect, FC } from 'react';
import cn from 'classnames';

type Props = {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>,
};

export const Notification: FC<Props> = ({ error, setError }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHidden(true);
    }, 3000);
  }, []);

  const handleCloseError = () => {
    setHidden(true);
    setError(null);
  };

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseError}
      />

      {error}
    </div>
  );
};
