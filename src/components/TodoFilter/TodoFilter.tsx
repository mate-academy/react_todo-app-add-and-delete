import { FC } from 'react';
import { Filters } from '../../types/Filters/Filters';
import {
  getActiveTodos,
  checkHasCompletedTodo,
} from '../../utils/helpers/filterService';
import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoContext';
import { useTodoActions } from '../../utils/hooks/useTodoActions';

export const TodoFilter: FC = () => {
  const { todos, setFilter, filter } = useTodoContext();
  const { clearCompletedTodos } = useTodoActions();

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getActiveTodos(todos).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue}`}
            onClick={() => setFilter(filterValue)}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!checkHasCompletedTodo(todos)}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
