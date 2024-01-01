import { useEffect, useState } from 'react';
// import { ErrorType } from '../types/ErrorType';
import classNames from 'classnames';
import { useTodo } from '../providers/TodoProvider';

export const Error = () => {
  const { error, setError } = useTodo();
  const [isHidden, setIsHidden] = useState<boolean>(true);

  enum Errors {
    load = 'Unable to load todos',
    title = 'Title should not be empty',
    add = 'Unable to add a todo',
    delete = 'Unable to delete a todo',
    update = 'Unable to update a todo',
  }

  useEffect(() => {
    setIsHidden(!error);

    setTimeout(() => {
      setIsHidden(true);
      setError(null);
    }, 3000);
  }, [error, setError]);

  const handleClick = () => {
    setError(null);
    setIsHidden(true);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: isHidden,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClick}
      />
      {error && Errors[error]}
    </div>
  );
};
