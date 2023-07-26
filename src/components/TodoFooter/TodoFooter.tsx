import { useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../../services/enums';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../services/types';

function countActiveTodos(todos: Todo[]): number {
  return todos.filter(todo => {
    return !todo.completed;
  }).length;
}

export const TodoFooter: React.FC = () => {
  const {
    todos,
    clearAllCompleted,
    filterBy,
    setFilterBy,
    isTodosHasCompleted,
  } = useContext(TodosContext);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countActiveTodos(todos)} `}
        items left
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === Filter.ALL,
          })}
          onClick={() => setFilterBy(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === Filter.ACTIVE,
          })}
          onClick={() => setFilterBy(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === Filter.COMPLETED,
          })}
          onClick={() => setFilterBy(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={clearAllCompleted}
        style={{ opacity: isTodosHasCompleted() ? 1 : 0 }}
      >
        Clear completed
      </button>
    </footer>
  );
};
