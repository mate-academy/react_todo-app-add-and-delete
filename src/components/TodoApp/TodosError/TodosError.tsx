/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import cn from 'classnames';

import { DispatchContext, StateContext, actionCreator } from '../../TodoStore';

export const TodosError: React.FC = () => {
  const { todoError } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (todoError) {
      timer = setTimeout(() => {
        dispatch(actionCreator.clearError());
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [todoError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !todoError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => dispatch(actionCreator.clearError())}
      />
      {todoError}
    </div>
  );
};
