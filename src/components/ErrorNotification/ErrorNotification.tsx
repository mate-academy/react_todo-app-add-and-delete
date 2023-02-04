import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '../../enums/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  clearError: () => void,
};

export const ErrorNotification: React.FC<Props> = ({ errorMessage, clearError }) => {
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setIsShown(false);
      clearError();
    }, 3000);
    return () => {
      clearInterval(timerID);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isShown },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="Close"
        type="button"
        className="delete"
        onClick={() => setIsShown(false)}
      />
      {errorMessage}
    </div>
  );
};
