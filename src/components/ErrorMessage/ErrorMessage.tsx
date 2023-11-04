import { useEffect, useState } from 'react';
import cn from 'classnames';

interface Props {
  error: string;
  onCloseError?: () => void;
}

export const ErrorMessage: React.FC<Props> = ({
  error,
  onCloseError = () => { },
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsVisible(false);
      onCloseError();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [onCloseError]);

  const handleHideError = () => {
    setIsVisible(false);
    onCloseError();
  };

  return (
    <>
      {isVisible && (
        <div
          data-cy="ErrorNotification"
          className={cn(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !isVisible },
          )}
        >
          {/* eslint-disable jsx-a11y/control-has-associated-label */}
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={handleHideError}
          />
          {error}
        </div>
      )}
    </>
  );
};
