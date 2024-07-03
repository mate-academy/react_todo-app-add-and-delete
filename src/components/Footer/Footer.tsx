import { useTodosContext } from '../../utils/useTodosContext';
import { TodoFilter } from '../TodoFilter';

export const Footer: React.FC = () => {
  const { todos, activeTodos, completedTodos, onDelete } = useTodosContext();

  function deleteTodo(todoId: number) {
    onDelete(todoId);
  }

  const handleDeleteCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  return (
    <div>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos.length} items left
        </span>
        <TodoFilter />

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completedTodos.length < 1}
          onClick={handleDeleteCompleted}
        >
          Clear completed
        </button>
      </footer>
    </div>
  );
};
