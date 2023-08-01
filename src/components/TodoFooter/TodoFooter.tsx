import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/enum';

type Props = {
  todos: Todo[] | null,
  activeTodos: number,
  filterBy: string,
  onFilterBy: (filterType: string) => void,
  removeCompleted: () => void,
};

export const TodoFooter:React.FC<Props> = ({
  todos,
  activeTodos,
  filterBy,
  onFilterBy,
  removeCompleted,
}) => {
  const completedTodo = todos?.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === FilterType.All,
          })}
          onClick={() => onFilterBy(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === FilterType.Active,
          })}
          onClick={() => onFilterBy(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === FilterType.Completed,
          })}
          onClick={() => onFilterBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={removeCompleted}
        disabled={!completedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
