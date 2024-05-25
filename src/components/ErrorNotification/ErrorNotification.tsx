import { useContext } from 'react';
import cn from 'classnames';
import { DispatchContext, TodosContext } from '../../Store';
/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorNotification: React.FC = () => {
  const { error } = useContext(TodosContext);
  const dispatch = useContext(DispatchContext);

  return (
    <div
      hidden={!error}
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => dispatch({ type: 'setError', payload: null })}
      />
      {error}
    </div>
  );
};
