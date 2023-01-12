import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { selectError } from '../../store/todos/todosSelectors';
import { todosActions } from '../../store/todos/todosSlice';

const TodosErrors:FC = () => {
  const dispatch = useAppDispatch();

  const error = useAppSelector(selectError);

  const clearError = () => {
    dispatch(todosActions.setInitialField('error'));
  };

  useEffect(() => {
    setTimeout(() => {
      clearError();
    }, 3000);
  }, [error]);

  if (!error) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line  */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {error}
    </div>
  );
};

export default TodosErrors;
