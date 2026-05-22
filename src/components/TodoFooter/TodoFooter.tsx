import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';
import { FilterButtons } from '../FilterButtons';

type FooterProps = {
  todos: Todo[];
  filterBy: FilterType;
  onFilter: (filter: FilterType) => void;
  onClear: () => void;
};

export const Footer = ({ todos, filterBy, onFilter, onClear }: FooterProps) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <FilterButtons filterBy={filterBy} onFilter={onFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.filter(todo => todo.completed).length === 0}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
