import { useTodosContext } from '../../helpers/useTodoContext';
import { TodoFilter } from '../TodoFilter/TodoFilter';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    activeTodos,
    filterSelected,
    setFilterSelected,
    completedTodos,
    onDelete,
  } = useTodosContext();

  const handleDeleteCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        onDelete(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <TodoFilter
        filterSelected={filterSelected}
        setFilterSelected={setFilterSelected}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
