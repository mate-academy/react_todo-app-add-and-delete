// #region imports
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';
// #endregion

// #region type Props
type Props = {
  todos: Todo[];
  filterOption: FilterOptions;
  onFilter: (newFilterOption: FilterOptions) => void;
  onDelete: (todoIds: number[]) => void;
};
// #endregion

export default function Footer({
  todos,
  filterOption,
  onFilter,
  onDelete,
}: Props) {
  const todosLeft = todos.filter(todo => !todo.completed);
  const todosCompleted = todos.filter(todo => todo.completed);

  function handleDeleteClick() {
    const todosCompletedId = todosCompleted.map(todo => todo.id);

    onDelete(todosCompletedId);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map((option, index) => (
          <a
            key={index}
            href="#/"
            className={cn('filter__link', {
              selected: filterOption === option,
            })}
            data-cy={'FilterLink' + option}
            onClick={() => onFilter(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosCompleted.length}
        onClick={handleDeleteClick}
      >
        Clear completed
      </button>
    </footer>
  );
}
