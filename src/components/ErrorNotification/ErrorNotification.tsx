/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, handleErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: errorMessage === ErrorMessage.DEFAULT,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleErrorMessage(ErrorMessage.DEFAULT)}
      />
      {errorMessage}
    </div>
  );
};
