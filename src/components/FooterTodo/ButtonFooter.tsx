import { FC, useContext } from 'react';
import { TodoContext, TodoDispatch } from '../../Context/TodoContext';
import { deleteTodo } from '../../api/todos';

interface IProps {
  showError: (err: string) => void;
}

export const ButtonFooter: FC<IProps> = ({ showError }) => {
  const { todos, numberComplete, handleFocusInput } = useContext(TodoContext);
  const dispatch = useContext(TodoDispatch);

  const clearCompleted = async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      await Promise.all(completedTodoIds.map(deleteTodo));
      dispatch({ type: 'DELETE_COMPLETED_TODO' });
      handleFocusInput();
    } catch (error) {
      showError('Unable to delete todos');
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
