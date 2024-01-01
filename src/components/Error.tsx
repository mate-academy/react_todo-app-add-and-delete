import { useEffect, useState } from 'react';
// import { ErrorType } from '../types/ErrorType';
import classNames from 'classnames';
import { useTodo } from '../providers/TodoProvider';
import { Errors } from '../types/ErrorType';

export const Error = () => {
  const { error, setError } = useTodo();
  const [isHidden, setIsHidden] = useState<boolean>(true);

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
