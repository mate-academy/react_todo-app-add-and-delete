/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TodosContext';

export const ErrorComponent: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
