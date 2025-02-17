import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../services/TodoContext';

export const ErrorMessage: React.FC = () => {
  const { errorMessage } = useContext(TodoContext);
  const [lastErrorMessage, setLastErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage !== '') {
      setLastErrorMessage(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {lastErrorMessage}
    </div>
  );
};
