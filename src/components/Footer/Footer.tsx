import React, { useContext } from 'react';

import { DispatchContex, StateContex } from '../../Store';
import { FilterNav } from '../FilterNav';
import { deleteTodo } from '../../api/todos';

export const Footer: React.FC = () => {
  const { todos } = useContext(StateContex);
  const dispatch = useContext(DispatchContex);

  const hasCompleted = todos.filter(todo => todo.completed).length;

  const countTodosLeft = todos.filter(t => !t.completed).length;

  const handlerClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        dispatch({
          type: 'add-pending-todo',
          payload: id,
        });

        deleteTodo(id)
          .then(res => {
            if (res === 1) {
              dispatch({ type: 'remove-todo', payload: id });
            }
          })
          .catch(() =>
            dispatch({
              type: 'set-error',
              payload: 'Unable to delete a todo',
            }),
          )
          .finally(() =>
            dispatch({
              type: 'remove-pending-todo',
              payload: id,
            }),
          );
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countTodosLeft} items left
      </span>

      <FilterNav />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handlerClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
