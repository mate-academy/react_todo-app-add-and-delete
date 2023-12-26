import React, { useCallback, useContext } from 'react';
import cn from 'classnames';
import { DispatchContext } from '../../Store';
import { TodoLoader } from '../TodoLoader';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
};
export const TodoItem: React.FC<Props> = React.memo(({ todo, isLoading }) => {
  const { id, title, completed } = todo;
  const dispatch = useContext(DispatchContext);

  const handleUpdateTodoError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.UpdateTodoError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  const handleDeleteTodoError = useCallback(() => {
    dispatch({ type: 'setError', payload: Error.DeleteTodoError });
    setTimeout(() => {
      dispatch({ type: 'setError', payload: '' });
    }, 3000);
  }, [dispatch]);

  const handleToggleTodo = useCallback(async () => {
    dispatch({ type: 'addLoading', payload: todo });

    try {
      await updateTodo(id, { completed: !completed });
      dispatch({ type: 'toggleTodo', payload: todo });
    } catch (error) {
      handleUpdateTodoError();
    } finally {
      dispatch({ type: 'deleteLoading', payload: todo });
    }
  }, [dispatch, id, completed, todo, handleUpdateTodoError]);

  const handleDeleteTodo = useCallback(async () => {
    dispatch({ type: 'addLoading', payload: todo });
    try {
      await deleteTodo(id);
      dispatch({ type: 'deleteTodo', payload: todo });
    } catch (error) {
      handleDeleteTodoError();
    } finally {
      dispatch({ type: 'deleteLoading', payload: todo });
    }
  }, [dispatch, id, todo, handleDeleteTodoError]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          checked={completed}
          data-cy="TodoStatus"
          className="todo__status"
          onChange={handleToggleTodo}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        data-cy="TodoDelete"
        aria-label="Delete todo"
        className="todo__remove"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <TodoLoader isLoading={isLoading} />
    </div>
  );
});
