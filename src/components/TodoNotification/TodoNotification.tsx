import classNames from 'classnames';
import React from 'react';
import { useTodos } from '../../TodosContext';

export const TodoNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  const handleErrorDelete = () => {
    setErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is - danger is - light has - text - weight - normal', {
          hidden: !errorMessage,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        title="Close error"
        onClick={handleErrorDelete}
      />
      {errorMessage}
    </div>
  );
};
