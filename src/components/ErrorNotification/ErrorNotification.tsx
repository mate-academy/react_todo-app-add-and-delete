/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: error.isError === false,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(er => ({ ...er, isError: false }))}
      />
      {error.message}
    </div>
  );
};
