import { FilterNav } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoNav } from '../TodoNav/TodoNav';

type Props = {
  todos: Todo[];
  handleFilter: (filterName: FilterNav) => void;
  selectFilter: FilterNav;
  handleDeleteAllTodo: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  handleFilter,
  selectFilter,
  handleDeleteAllTodo,
}) => {
  const deleteAll = () => {
    handleDeleteAllTodo();
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <TodoNav handleFilter={handleFilter} selectFilter={selectFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={deleteAll}
      >
        Clear completed
      </button>
    </footer>
  );
};
