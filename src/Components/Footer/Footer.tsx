import React, { useContext, useMemo } from 'react';
import { Filters } from '../Filters';
import { Actions, DispatchContext, StateContext } from '../../Store';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

export const Footer: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const isActiveTodos = useMemo(() => {
    return todos.filter((todo: Todo) => !todo.completed);
  }, [todos]);
  const isDisableCompleted = useMemo(() => {
    return todos.some((todo: Todo) => todo.completed);
  }, [todos]);

  const handleDeleteCompleted = () => {
    todos
      .filter((todo: Todo) => todo.completed)
      .map((todo: Todo) => {
        deleteTodos(todo.id)
          .then(() => {
            dispatch({ type: Actions.deleteCompleted });
          })
          .catch(error => {
            dispatch({
              type: Actions.setErrorLoad,
              payload: '',
            });
            dispatch({
              type: Actions.setErrorLoad,
              payload: 'Unable to delete all todos',
            });

            throw error;
          });
      });
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
