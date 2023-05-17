import { useEffect, useState } from 'react';
import cn from 'classnames';

interface Props {
  errorNotification: string;
}

export const ErrorNotification: React.FC<Props> = ({ errorNotification }) => {
  const [isHidden, setHidden] = useState(false);

  const handleClose = () => {
    setHidden(true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(handleClose, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: isHidden },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={handleClose}
      />
      {errorNotification}
    </div>
  );
};
