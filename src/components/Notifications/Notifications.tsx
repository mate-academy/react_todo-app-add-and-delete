import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorText } from '../../types/ErrorText';

type Props = {
  errorMessage: ErrorText,
  onSetErrorMessage: (text: ErrorText) => void,
};

export const Notifications: React.FC<Props> = ({
  errorMessage,
  onSetErrorMessage,
}) => {
  const handlerDeleteError = () => onSetErrorMessage(ErrorText.Empty);

  useEffect(() => {
    const timerID = setTimeout(handlerDeleteError, 3000);

    return () => clearTimeout(timerID);
  }, [errorMessage]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMessage.length },
    )}
    >
      {errorMessage}

      <button
        aria-label="Delate-Error-Message"
        type="button"
        className="delete"
        onClick={handlerDeleteError}
      />
    </div>
  );
};
