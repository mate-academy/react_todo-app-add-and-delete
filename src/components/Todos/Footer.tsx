import { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  setFilterType: Dispatch<SetStateAction<FilterType>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
}) => {
  const handleRemoveCompleted = () => {
    todos.forEach(todo => (todo.completed ? deleteTodo(todo.id) : todo));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.All,
            },
          )}
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.Active,
            },
          )}
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.Completed,
            },
          )}
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
