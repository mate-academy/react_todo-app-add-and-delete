import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  filterBy: Filter;
  setFilterBy: React.Dispatch<React.SetStateAction<Filter>>;
  clearCompleted: () => void
};

export const TodosFilter: React.FC<Props> = (
  {
    todos,
    filterBy,
    setFilterBy,
    clearCompleted,
  },
) => {
  const handleSetFilteredTodos = (filter: Filter) => () => {
    setFilterBy(filter);
  };

  const completedTodosLength
    = todos.filter(todo => todo.completed).length;

  const uncompletedTodosLength
    = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosLength} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: (filterBy === Filter.all),
          })}
          onClick={handleSetFilteredTodos(Filter.all)}
        >
          All
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: (filterBy === Filter.completed),
          })}
          onClick={handleSetFilteredTodos(Filter.completed)}
        >
          Completed
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: (filterBy === Filter.active),
          })}
          onClick={handleSetFilteredTodos(Filter.active)}
        >
          Active
        </a>

      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn(
          'todoapp__clear-completed',
          {
            hidden: !completedTodosLength,
          },
        )}
        onClick={clearCompleted}
        disabled={!completedTodosLength}
      >
        Clear completed
      </button>
    </footer>
  );
};
