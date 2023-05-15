import { useEffect, useState } from 'react';
import cn from 'classnames';

interface Props {
  errorNotification: string;
}

export const ErrorNotification: React.FC<Props> = ({ errorNotification }) => {
  const [isHidden, setHidden] = useState(false);

  const hadleHidding = () => {
    setHidden(true);
  };

  useEffect(() => {
    setTimeout(hadleHidding, 3000);
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
        onClick={hadleHidding}
      />
      {errorNotification}
    </div>
  );
};
