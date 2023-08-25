import { useCallback, useContext } from 'react';
import cn from 'classnames';
import { GlobalContext } from '../context/GlobalContext';
import { FilterType } from '../types/FilterTypes';

type Props = {
  status: string;
  setStatus: (arg: FilterType) => void;
};

export const Footer: React.FC<Props> = ({ status, setStatus }) => {
  const { todos, removeAllCompleted } = useContext(GlobalContext);

  const handleFilter = (filterType: FilterType) => () => setStatus(filterType);

  const includesCompletedTodo = useCallback(() => {
    return todos.some((todo) => todo.completed);
  }, [todos]);

  const onClearCompletedButton = () => {
    return removeAllCompleted();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todos.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: status === 'all' })}
          onClick={handleFilter(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: status === 'active' })}
          onClick={handleFilter(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: status === 'completed' })}
          onClick={handleFilter(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompletedButton}
        disabled={!includesCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
