import React, { useCallback, useContext } from 'react';
import { TodoFilter } from '../TodoFilter';
import { DispatchContext, StateContext } from '../../Store';
import { deleteTodo } from '../../api/todos';
import { Error } from '../../types/Error';

export const TodoFooter: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);
  const todosToComplete = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const hasCompletedTodos = completedTodos.length > 0;

  const handleDeleteTodoError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.DeleteTodoError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(async todo => {
      try {
        await deleteTodo(todo.id);
        dispatch({ type: 'deleteTodo', payload: todo });
      } catch (error) {
        handleDeleteTodoError();
      }
    });
  }, [dispatch, completedTodos, handleDeleteTodoError]);

  return (
    <footer
      data-cy="TodoFooter"
      className="todoapp__footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosToComplete} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
