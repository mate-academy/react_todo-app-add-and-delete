/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext/TodosContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  let isErrorHidden = true;

  if (errorMessage !== '') {
    isErrorHidden = false;
    setTimeout(() => {
      setErrorMessage('');
      isErrorHidden = true;
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        { hidden: isErrorHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
          isErrorHidden = true;
        }}
      />
      {errorMessage}
    </div>
  );
};
