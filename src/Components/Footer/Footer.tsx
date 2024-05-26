import React, { useContext, useMemo, useState } from 'react';
import { Filters } from '../Filters';
import { Actions, DispatchContext, StateContext } from '../../Store';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

export const Footer: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [errorsIds] = useState<number[]>([]);
  const isActiveTodos = useMemo(() => {
    return todos.filter((todo: Todo) => !todo.completed);
  }, [todos]);
  const isDisableCompleted = useMemo(() => {
    return todos.some((todo: Todo) => todo.completed);
  }, [todos]);

  const handleDeleteCompleted = () => {
    dispatch({ type: Actions.setIsRemoving, status: true });
    const completedIds = todos.filter(todo => todo.completed).map(t => t.id);

    Promise.all(
      completedIds.map(id =>
        deleteTodos(id)
          .then(() => {
            dispatch({ type: Actions.deleteCompletedId, id });
          })
          .catch(error => {
            dispatch({
              type: Actions.setErrorLoad,
              payload: 'Unable to delete a todo',
            });
            errorsIds.push(id);
            throw error;
          })
          .finally(() => {
            dispatch({ type: Actions.setIsRemoving, status: false });
          }),
      ),
    );
  };

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {isActiveTodos.length} items left
        </span>

        {/* Active link should have the 'selected' class + */}
        <Filters />

        {/* this button should be disabled if there are no completed todos + */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!isDisableCompleted}
          onClick={handleDeleteCompleted}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
