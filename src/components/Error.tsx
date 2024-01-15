/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useContext } from 'react';
import { TodosContext } from './TodosContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  let isErrorHidden = true;

  const hideError = () => {
    setErrorMessage('');
    isErrorHidden = true;
  };

  if (errorMessage) {
    isErrorHidden = false;
    setTimeout(hideError, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isErrorHidden })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {errorMessage}
    </div>
  );
};
