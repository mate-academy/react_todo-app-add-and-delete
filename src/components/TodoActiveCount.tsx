import { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';

export const TodoActiveCount = () => {
  const { todos } = useContext(TodosContext);
  const activeTasksCount = todos.filter(todo => !todo.completed).length;

  return (
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTasksCount} items left`}
    </span>
  );
};
