import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorContext } from '../providers/TodosProvider';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(ErrorContext);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedError, setDisplayedError] = useState('');

  useEffect(() => {
    let timerId: NodeJS.Timeout | null;

    if (errorMessage) {
      setIsVisible(true);
      setDisplayedError(errorMessage);
      timerId = setTimeout(() => {
        setErrorMessage('');
        setIsVisible(false);
      }, 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [errorMessage, setErrorMessage]);

  useEffect(() => {
    return () => {
      setIsVisible(false);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error message"
        onClick={() => setIsVisible(false)}
      />
      {displayedError}
      {/* show only one message at a time */}
      {/* Unable to update a todo */}
    </div>
  );
};
