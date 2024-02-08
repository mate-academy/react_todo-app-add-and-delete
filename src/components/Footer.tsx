import classNames from 'classnames';
import { useCallback, useContext, useMemo } from 'react';
import { FilterBy } from '../types/FilterBy';
import { TodosContext } from './TodoContext';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filterBy,
    setFilterBy,
  } = useContext(TodosContext);

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const activeCompleted = todos.filter(todo => todo.completed).length;

  const enumToArray = useCallback(
    (data: typeof FilterBy): string[] => Object.values(data),
    [],
  );

  const filterButtons = useMemo(() => enumToArray(FilterBy), [enumToArray]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">

        {filterButtons.map(item => (
          <a
            key={item}
            href={`#/${item === FilterBy.All ? '' : item.toLowerCase()}`}
            className={classNames(
              'filter__link',
              { selected: filterBy === item },
            )}
            data-cy={`FilterLink${item}`}
            onClick={() => setFilterBy(item as FilterBy)}
          >
            {item}
          </a>
        ))}
      </nav>

      {activeCompleted > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
