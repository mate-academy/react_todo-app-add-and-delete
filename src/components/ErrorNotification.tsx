/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext } from 'react';
import classNames from 'classnames';

import { ErrorMessage } from '../types/ErrorMessage';
import { TodosContext } from './TodoContext';

export const ErrorNotification = () => {
  const { errorMessage, addErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === ErrorMessage.Any },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => addErrorMessage(ErrorMessage.Any)}
      />
      {errorMessage}
    </div>
  );
};
