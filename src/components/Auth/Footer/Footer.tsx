import { useMemo } from 'react';
import classnames from 'classnames';
import { FilterType } from '../../../types/SortType';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[];
  filterType: FilterType | string;
  filterTypes: (arg: FilterType) => void;
  deleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  filterTypes,
  deleteCompleted,
}) => {
  const todosLeft = useMemo(() => (
    todos.filter(({ completed }) => !completed).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed).length), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => filterTypes(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => filterTypes(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => filterTypes(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleted}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
