import React, { useContext } from 'react';
import { TodoFilter } from './TodoFilter';
import { DispatchContext, StateContext } from '../management/TodoContext';
import { deleteTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const allCompletedTodos = todos.filter(todo => todo.completed);
  const completedTodos = todos.some(todo => todo.completed);

  const handleDeleteAllCompleted = () => {
    dispatch({ type: 'isLoading', payload: true });

    allCompletedTodos.forEach(todo => {
      dispatch({ type: 'createCurrentId', payload: todo.id });

      deleteTodo(todo.id)
        .then(() => {
          dispatch({ type: 'deleteTodo', payload: todo.id });
        })
        .catch(() => {
          dispatch({
            type: 'errorMessage',
            payload: 'Unable to delete a todo',
          });
        })
        .finally(() => {
          dispatch({ type: 'isLoading', payload: false });
          dispatch({ type: 'clearCurrentId' });
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
