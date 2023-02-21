import classNames from 'classnames';
import { useEffect, useState } from 'react';

type Props = {
  hasError: boolean,
  setHasError: (value: boolean) => void,
  errorType:string,
};

export const Notification:React.FC<Props> = ({
  errorType,
  hasError,
  setHasError,
}) => {
  const [isHidden, setIsHidden] = useState(true);

  const timeToCloseNotification = () => {
    const timeOutId = window.setTimeout(() => {
      setIsHidden(true);
      setHasError(false);
    }, 3000);

    window.clearTimeout(timeOutId);
  };

  useEffect(() => {
    if (hasError) {
      setIsHidden(false);
      timeToCloseNotification();
    } else {
      setIsHidden(true);
    }
  }, [hasError]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      <button
        type="button"
        aria-label="button"
        className="delete"
        onClick={() => {
          setIsHidden(true);
        }}
      />
      {`${errorType}`}
    </div>
  );
};
