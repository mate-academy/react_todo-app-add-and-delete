/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext/TodosContext';

export const ErrorNotification: React.FC = () => {
  const {
    isHiddenError,
    setIsHiddenError,
    hasErrorMessage,
  } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isHiddenError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHiddenError(false)}
      />
      {hasErrorMessage}
      {/* <br />
              Title should not be empty
              <br />
              Unable to add a todo
              <br />
              Unable to delete a todo
              <br />
              Unable to update a todo */}
    </div>
  );
};
