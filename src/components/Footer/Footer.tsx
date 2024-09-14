import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { FilterItem } from '../FilterItem';

interface Props {
  todosAmount: number;
  filterTodos: Filter;
  completedTodos: Todo[] | undefined;
  setFilterTodos: React.Dispatch<React.SetStateAction<Filter>>;
  deleteCompleted: (completed: Todo[]) => void;
}

export const Footer: React.FC<Props> = ({
  todosAmount,
  filterTodos,
  setFilterTodos,
  completedTodos,
  deleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosAmount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterItem => (
          <FilterItem
            key={filterItem}
            filterTodos={filterTodos}
            filterItem={filterItem}
            setFilterTodos={setFilterTodos}
          />
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => completedTodos && deleteCompleted(completedTodos)}
        disabled={!completedTodos || completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
