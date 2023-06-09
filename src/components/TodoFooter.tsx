import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  setFilteringMode: (arg0: string) => void,
  filteringMode: string;
  todos: Todo[],
}

export const TodoFooter: React.FC<Props>
  = ({ setFilteringMode, filteringMode, todos }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          3 items left
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter">
          <a
            href="#/"
            className={cn({
              filter__link: true,
              selected: filteringMode === 'all',
            })}
            onClick={() => setFilteringMode('all')}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn({
              filter__link: true,
              selected: filteringMode === 'active',
            })}
            onClick={() => setFilteringMode('active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn({
              filter__link: true,
              selected: filteringMode === 'completed',
            })}
            onClick={() => setFilteringMode('completed')}
          >
            Completed
          </a>
        </nav>

        {/* don't show this button if there are no completed todos */}
        <button
          type="button"
          className={cn({
            'todoapp__clear-completed': true,
            'todoapp__clear-completed__hidden':
              !todos.find(todo => todo.completed),
          })}
        >
          Clear completed
        </button>
      </footer>
    );
  };
