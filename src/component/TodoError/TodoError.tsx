import cn from 'classnames';
import { useContext, useEffect, useRef } from 'react';
import { DispatchContext, StateContext } from '../../store/store';

export const TodoError = () => {
  const dispatch = useContext(DispatchContext);
  const { errorsInTodo } = useContext(StateContext);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }

    if (errorsInTodo) {
      timeoutId.current = setTimeout(() => {
        dispatch({ type: 'setError', error: '' });
      }, 3000);
    }
  }, [dispatch, errorsInTodo]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorsInTodo,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* show only one message at a time */}
      {errorsInTodo && (
        <>
          {errorsInTodo}
          <br />
        </>
      )}
      {/* 
      <br />
      Unable to update a todo */}
    </div>
  );
};
