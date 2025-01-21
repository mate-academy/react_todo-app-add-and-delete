import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface ErrorsProps {
  error: string;
}

export const Errors: React.FC<ErrorsProps> = ({ error }) => {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (error.length === 0) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {error}
    </div>
  );
};
