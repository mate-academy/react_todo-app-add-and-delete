import { useTodos } from '../../utils/TodoContext';
import { TodoFilter } from '../TodoFilter';

export const TodoFooter: React.FC = () => {
  const { todos, setTodos } = useTodos();
  const isClearButtonActive = todos.some(todo => todo.completed);
  const countActiveTodos = todos.filter(todo => !todo.completed).length;

  const clearAllCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      <TodoFilter />

      {isClearButtonActive && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => clearAllCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
