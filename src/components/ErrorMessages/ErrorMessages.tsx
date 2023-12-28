import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TododsContext/TodosContext';

export const ErrorMessages: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      setIsErrorHidden(false);
      setTimeout(() => {
        setErrorMessage('');
        setIsErrorHidden(true);
      }, 3000);
    }
  }, [setErrorMessage, errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: isErrorHidden,
        })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setIsErrorHidden(true);
        }}
      />
      {errorMessage}
    </div>
  );
};
