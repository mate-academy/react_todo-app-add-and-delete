import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from './TodoContext';

export const TodoErrors: React.FC = () => {
  const todoContext = useContext(TodosContext);

  if (!todoContext) {
    return null;
  }

  const { error, resetError } = todoContext;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        resetError();
      }, 3000);
    }

    return () => {};
  }, [error]);

  function handleErrorHiding(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    resetError();
  }

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleErrorHiding}
        aria-label="Close"
      />
      {error}
    </div>
  );
};
