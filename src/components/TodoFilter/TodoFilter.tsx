import classNames from 'classnames';
import { TodoType } from '../../types/Todo';

export type Filters = 'all' | 'active' | 'completed';

type TodoFilterProps = {
  activeFilter: Filters;
  changeFilter: (filterName: Filters) => void;
  completedTodos: TodoType[];
  activeTodos: TodoType[];
};

export const TodoFilter = ({
  changeFilter,
  activeFilter,
  completedTodos,
  activeTodos,
}: TodoFilterProps) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            classNames(
              'filter__link',
              { selected: activeFilter === 'all' },
            )
          }
          onClick={() => changeFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames(
              'filter__link',
              { selected: activeFilter === 'active' },
            )
          }
          onClick={() => changeFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames(
              'filter__link',
              { selected: activeFilter === 'completed' },
            )
          }
          onClick={() => changeFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {
        completedTodos.length > 0 && (
          <button type="button" className="todoapp__clear-completed">
            Clear completed
          </button>
        )
      }
    </footer>
  );
};
