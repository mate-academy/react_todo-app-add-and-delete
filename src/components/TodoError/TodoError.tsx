import React, { useEffect } from 'react';
import classNames from 'classnames';
import { TodoErrorType } from '../../types/TodoErrorType';

type Props = {
  hasError: string,
  setHasError: (error: TodoErrorType) => void,
};
export const TodoError: React.FC<Props> = ({
  hasError,
  setHasError,
}) => {
  useEffect(() => {
    setTimeout(() => setHasError(TodoErrorType.noError), 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Close"
        onClick={() => setHasError(TodoErrorType.noError)}
      />
      {hasError}
    </div>
  );
};
