import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { ErrorMessage } from '../../types/errorMessage';

type Props = {

};

export const Error: React.FC<Props> = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === ErrorMessage.NO },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => setErrorMessage(ErrorMessage.NO)}
      />

      { errorMessage }
    </div>
  );
};
