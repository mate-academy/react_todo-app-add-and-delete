import cn from 'classnames';
import { FilterStatus } from '../../types/Filter';
import { toCapitalCase } from '../../utils/toCapitalCase';
import { useTodoContext } from '../../store/todoContext';

export const TodoFooter = () => {
  const { changeFilterStatus, filterStatus, todoLength } = useTodoContext();

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span
        className="todo-count"
        data-cy="todosCounter"
      >
        {todoLength > 0 && `${todoLength} items left`}
      </span>

      <nav
        className="filter"
        data-cy="Filter"
      >
        {(Object.keys(FilterStatus) as Array<keyof typeof FilterStatus>).map(
          status => (
            <a
              key={status}
              data-cy={`FilterLink${status}`}
              href={`#/${FilterStatus[status]}`}
              className={cn('filter__link', {
                selected: filterStatus === FilterStatus[status],
              })}
              onClick={() => changeFilterStatus(FilterStatus[status])}
            >
              {toCapitalCase(FilterStatus[status])}
            </a>
          ),
        )}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
