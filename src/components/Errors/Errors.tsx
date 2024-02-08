import { useContext, useRef } from 'react';
import cn from 'classnames';
import { ErrorTypes } from '../../types/ErrorTypes';
import { TodosContext } from '../TodoContext/TodoContext';

export const Errors: React.FC = () => {
  const { hasError, setHasError } = useContext(TodosContext);
  const ref = useRef(0);

  if (hasError !== ErrorTypes.Initial) {
    window.clearTimeout(ref.current);
    ref.current = window
      .setTimeout(() => setHasError(ErrorTypes.Initial), 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={() => setHasError(ErrorTypes.Initial)}
      />
      {hasError}
    </div>
  );
};
