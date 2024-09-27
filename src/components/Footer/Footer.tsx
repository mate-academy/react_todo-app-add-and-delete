import classNames from 'classnames';
import { SortField } from '../../types/SortField';
import { Todo } from '../../types/Todo';

import './Footer.scss';
type Props = {
  todos: Todo[];
  filter: SortField;
  handelFilter: (filter: SortField) => void;
  handleClearCompleted: () => void;
};
export const Footer: React.FC<Props> = ({
  todos,
  filter,
  handelFilter,
  handleClearCompleted,
}) => {
  const clearSelected = todos.some(todo => todo.completed);
  const allTodosNotCompleted = todos.filter(todo => !todo.completed).length;
  const filters = Object.values(SortField);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {allTodosNotCompleted} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <nav className="filter" data-cy="Filter">
          {filters.map(filterOption => (
            <a
              key={filterOption}
              href={`#/${filterOption}`}
              className={classNames('filter__link', {
                selected: filter === filterOption,
              })}
              data-cy={`FilterLink${filterOption}`}
              onClick={() => handelFilter(filterOption)}
            >
              {filterOption}
            </a>
          ))}
        </nav>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!clearSelected}
      >
        Clear completed
      </button>
    </footer>
  );
};
