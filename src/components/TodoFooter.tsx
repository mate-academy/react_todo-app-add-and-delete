import { useTodo } from '../providers/TodoProvider';
import { FilterType } from '../types/FilterType';
import { Filter } from './Filter';

const FILTER_VALUES: FilterType[] = ['All', 'Active', 'Completed'];

export const TodoFooter = () => {
  const {
    todos, todosLeft,
  } = useTodo();

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_VALUES.map(filter => (
          <Filter key={filter} filter={filter} />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosLeft === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
