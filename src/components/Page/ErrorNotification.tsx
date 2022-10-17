import classNames from 'classnames';
import React from 'react';
import { TodosError } from '../../types/ErrorEnum';

type Props = {
  errorContent: TodosError;
  setError: React.Dispatch<React.SetStateAction<TodosError>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorContent,
  setError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorContent.length },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(TodosError.None)}
      >
        {null}
      </button>

      {errorContent}
    </div>
  );
};
