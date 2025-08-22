import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  filterBy: Filter;
  activeCount: number;
  setFilterBy: React.Dispatch<React.SetStateAction<Filter>>;
  visibleTodos: Todo[];
  deleteTodo: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  activeCount,
  setFilterBy,
  visibleTodos,
  deleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={visibleTodos.every(todo => !todo.completed)}
        onClick={() => {
          const completedTodo = visibleTodos.filter(todo => todo.completed);

          completedTodo.forEach(todo => deleteTodo(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
