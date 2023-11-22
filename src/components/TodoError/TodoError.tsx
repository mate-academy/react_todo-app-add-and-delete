/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { Error } from '../../types/Error';
import { DispatchContext, StateContext } from '../../Context/Store';

export const TodoError: React.FC = () => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const resetError = () => dispatch({
    type: 'setError',
    payload: Error.Default,
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification',
        'is-danger', 'is-light',
        'has-text-weight-normal',
        { hidden: state.error === Error.Default })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => resetError()}
      />
      {/* show only one message at a time */}
      {state.error === Error.UnableLoadTodos && (
        <>
          Unable to load todos
        </>
      )}
      {state.error === Error.TitleNotEmpty && (
        <>
          <br />
          Title should not be empty
        </>
      )}
      {state.error === Error.UnableAddTodo && (
        <>
          <br />
          Unable to add a todo
        </>
      )}
      {
        state.error === Error.UnableDeleteTodo && (
          <>
            <br />
            Unable to delete a todo
          </>
        )
      }
      {state.error === Error.UnableUpdateTodo && (
        <>
          <br />
          Unable to update a todo
        </>

      )}

    </div>
  );
};
