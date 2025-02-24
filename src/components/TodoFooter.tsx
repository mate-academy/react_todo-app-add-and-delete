import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filterField: string;
  filterBy: (field: string) => void;
  clearCompleted: (allTodos: Todo[]) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterField,
  filterBy,
  clearCompleted,
}) => {
  const todosCounter = [...todos].filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filterField === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => filterBy('all')}
        >
          All
        </a>
        <a
          href="#/active"
          className={cn('filter__link', { selected: filterField === 'active' })}
          data-cy="FilterLinkActive"
          onClick={() => filterBy('active')}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterField === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterBy('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      {/* {todosCounter !== todos.length && ( */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosCounter === todos.length}
        onClick={() => clearCompleted(todos)}
      >
        Clear completed
      </button>
      {/* // )} */}
    </footer>
  );
};
