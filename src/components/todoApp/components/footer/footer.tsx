import React, { useContext } from 'react';
import { DispatchContext, TodosContext } from '../../../../Store';
import { TodosFilter } from './TodosFilter';
import { deleteTodo } from '../../../../api/todos';

export const Footer: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const dispatch = useContext(DispatchContext);
  const isCompletedTodos = todos.some(todo => todo.completed);
  // const counter = `${todos.filter(todo => !todo.completed).length} ${todos.filter(todo => !todo.completed).length > 1 ? 'items' : 'item'} left`;
  const counter = `${todos.filter(todo => !todo.completed).length} items left`;

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        dispatch({
          type: 'loading',
          payload: { load: true, id: todo.id || 0 },
        });
        deleteTodo(todo.id || 0)
          .then(() => {
            dispatch({ type: 'deleteTodo', payload: todo.id });
            if (todos.length) {
              dispatch({ type: 'setIsTodoDeleted', payload: true });
            }
          })
          .catch(() => {
            dispatch({
              type: 'setError',
              payload: 'Unable to delete a todo',
            });
          })
          .finally(() => {
            dispatch({
              type: 'loading',
              payload: { load: false, id: todo.id || 0 },
            });
            const timeout = setTimeout(() => {
              dispatch({ type: 'setError', payload: null });
              clearTimeout(timeout);
            }, 3000);
          });
      }
    });
  };

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {counter}
          </span>

          <TodosFilter />

          <div>
            <button
              type="button"
              className="todoapp__clear-completed "
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!isCompletedTodos}
            >
              Clear completed
            </button>
          </div>
        </footer>
      )}
    </>
  );
};
