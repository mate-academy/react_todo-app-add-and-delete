import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../Enum/ErrorMessage';
import { useTodo } from '../Hooks/UseTodo';

export const ErrorNotification: React.FC = () => {
  const { isError, setIsError } = useTodo();

  const closeErrorMessage = () => {
    setIsError(ErrorMessage.NONE);
  };

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(ErrorMessage.NONE);
      }, 3000);
    }
  }, [isError, setIsError]);

  return (
    <>
      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !ErrorMessage.NONE },
      )}
      >
        <button
          type="button"
          aria-label="close ErrorMessage"
          className="delete"
          onClick={closeErrorMessage}
        />
        {isError}
      </div>
    </>
  );
};
