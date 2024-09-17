import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTodos } from './TodoContext';
import { ErrorText } from '../types/ErrorText';

export const ErrorNotification: React.FC = () => {
  const { errMessage, setErrMessage } = useTodos();
  const [errorMessageVisible, setErrorMessageVisible] = useState(true);

  useEffect(() => {
    if (errMessage !== ErrorText.NoErr) {
      const timer = setTimeout(() => {
        setErrMessage(ErrorText.NoErr);
        setErrorMessageVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return () => {};
  }, [errMessage, setErrMessage]);

  return (
    <>
      {errorMessageVisible && (
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: errMessage === ErrorText.NoErr },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => {
              setErrMessage(ErrorText.NoErr);
              setErrorMessageVisible(false);
            }}
          />
          {errMessage}
        </div>
      )}
    </>
  );
};
