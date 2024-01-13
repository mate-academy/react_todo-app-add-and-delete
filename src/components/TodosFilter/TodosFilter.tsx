import cn from 'classnames';
import { memo } from 'react';
import { ShowTodos } from '../../types/StatusTodo';

type Props = {
  selectedTodos: ShowTodos,
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
          { selected: selectedTodos === ShowTodos.All },
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
          { selected: selectedTodos === ShowTodos.Active },
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
          { selected: selectedTodos === ShowTodos.Completed },
        )}
        onClick={handleSelectedTodos}
      >
        Completed
      </a>
    </nav>
  );
});
