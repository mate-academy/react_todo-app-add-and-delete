import { FC, useContext } from 'react';
import { TodoContext, TodoDispatch } from '../../Context/TodoContext';
import { deleteTodo } from '../../api/todos';

interface IProps {
  showError: (err: string) => void;
  setLoading: (bool: boolean) => void;
}

export const ButtonFooter: FC<IProps> = ({ showError, setLoading }) => {
  const { todos, numberComplete, handleFocusInput } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);

  const clearCompleted = async () => {
    setLoading(true);
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfulDeletions = results
        .map((result, index) => ({ result, todo: completedTodos[index] }))
        .filter(({ result }) => result.status === 'fulfilled')
        .map(({ todo }) => todo.id);

      if (successfulDeletions.length > 0) {
        dispatch({
          type: 'DELETE_COMPLETED_TODO',
          payload: successfulDeletions,
        });
        handleFocusInput();
      }

      const failedDeletions = results.some(
        result => result.status === 'rejected',
      );

      if (failedDeletions) {
        showError('Unable to delete a todo');
      }
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={numberComplete === 0}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  );
};
