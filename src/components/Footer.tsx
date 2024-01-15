import { useContext } from 'react';
import { TodosContext } from './TodosContext';
import { getNumberActiveTodo } from '../utils/getNumber';
import { TodosFilter } from './TodosFilter';

export const Footer: React.FC = () => {
  const { todos, setTodos } = useContext(TodosContext);

  const handleDeleteCompleted = () => {
    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  };

  const isVisibleClearBtn = todos.some(todo => todo.completed);
  const countTodosActive = getNumberActiveTodo(todos);

  const todosCounterText = `${countTodosActive} item${countTodosActive !== 1 ? 's' : ''} left`;

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounterText}
      </span>

      <TodosFilter />

      {isVisibleClearBtn && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
