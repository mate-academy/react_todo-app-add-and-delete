import cn from 'classnames';
import { memo } from 'react';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  selectedTodos: TodoFilter,
  handleSelectedTodos: (event: React.MouseEvent<HTMLAnchorElement>) => void,
};
export const TodosFilter:React.FC<Props> = memo(({
  selectedTodos,
  handleSelectedTodos,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={cn(
          'filter__link',
          { selected: selectedTodos === TodoFilter.All },
        )}
        onClick={handleSelectedTodos}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={cn(
          'filter__link',
          { selected: selectedTodos === TodoFilter.Active },
        )}
        onClick={handleSelectedTodos}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={cn(
          'filter__link',
          { selected: selectedTodos === TodoFilter.Completed },
        )}
        onClick={handleSelectedTodos}
      >
        Completed
      </a>
    </nav>
  );
});
