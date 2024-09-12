import React, { useContext } from 'react';
import { TodosContext } from './TodosContext';
import classNames from 'classnames';
import { Errors } from '../types/Errors';

export const ErrorNotification: React.FC = () => {
  const { messageError, setMessageError } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !messageError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setMessageError(Errors.NoError)}
      />

      {messageError && <span>{messageError}</span>}
    </div>
  );
};
