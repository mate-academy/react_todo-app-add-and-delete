import React, { useContext } from 'react';
import { Filter } from './Filter';
import { DispatchContext, StateContext } from './TodosContext';
import { deleteTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const completedTodoIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const numberActiveTodos = todos.length - completedTodoIds.length;

  const handleClearCompleted = () => {
    dispatch({
      type: 'setLoading',
      payload: { isLoading: true, todoIds: completedTodoIds },
    });

    Promise.allSettled(
      completedTodoIds.map(id => deleteTodo(id)
        .then(() => id)),
    )
      .then(results => {
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            dispatch({
              type: 'deleteTodo',
              payload: result.value,
            });
          }

          if (result.status === 'rejected') {
            dispatch({
              type: 'setErrorMessage',
              payload: 'Unable to delete a todo',
            });
          }
        });
      })
      .finally(() => dispatch({
        type: 'setLoading',
        payload: { isLoading: false },
      }));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {numberActiveTodos === 1 ? (
        <span className="todo-count" data-cy="todosCounter">
          1 item left
        </span>
      ) : (
        <span className="todo-count" data-cy="todosCounter">
          {`${numberActiveTodos} items left`}
        </span>
      )}

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodoIds.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
