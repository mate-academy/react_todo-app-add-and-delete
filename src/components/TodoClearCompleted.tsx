import { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';

export const TodoClearCompleted = () => {
  const { todos, setTodos } = useContext(TodosContext);
  const handleDeleteCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
  };

  const completedTasksCount = todos.filter(todo => todo.completed).length;

  return (
    <button
      type="button"
      className="todoapp__clear-completed "
      style={{ visibility: completedTasksCount === 0 ? 'hidden' : 'visible' }}
      data-cy="ClearCompletedButton"
      onClick={handleDeleteCompleted}
    >
      Clear completed
    </button>
  );
};
