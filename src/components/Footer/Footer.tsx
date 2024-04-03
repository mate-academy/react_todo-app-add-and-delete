import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter';

type Props = {
  todos: Todo[];
  currentFilter: Filter;
  setFilter: (filter: Filter) => void;
  onDelete: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  currentFilter,
  setFilter,
  onDelete,
}) => {
  const completedTodos = todos.filter(({ completed }) => completed);

  const deleteAllCompleted = () => {
    for (const { id } of completedTodos) {
      onDelete(id);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - completedTodos.length} items left
      </span>

      <TodoFilter currentFilter={currentFilter} onClick={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
