import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';

type Props = {
  activeTodos: Todo[],
  completedTodos: Todo[],
  selectedFilter: Filters,
  onSetSelectedFilter: (char: Filters) => void,
  onDeleteTodo: (todoId: number[]) => void,
};

export const Filter: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  selectedFilter,
  onSetSelectedFilter,
  onDeleteTodo,
}) => {
  const handlerClearCompleted = () => {
    const completedTodosIds = completedTodos.map(t => t.id);

    onDeleteTodo(completedTodosIds);
  };

  return (
    <footer className="todoapp__footer">
      {' '}
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <button
          type="button"
          className={classNames(
            'filter__link', { selected: selectedFilter === 'all' },
          )}
          onClick={() => onSetSelectedFilter(Filters.All)}
        >
          All
        </button>

        <button
          type="button"
          className={classNames(
            'filter__link', { selected: selectedFilter === 'active' },
          )}
          onClick={() => onSetSelectedFilter(Filters.Active)}
        >
          Active
        </button>

        <button
          type="button"
          className={classNames(
            'filter__link', { selected: selectedFilter === 'completed' },
          )}
          onClick={() => onSetSelectedFilter(Filters.Completed)}
        >
          Completed
        </button>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed', { hidden: completedTodos.length < 1 },
        )}
        onClick={handlerClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
