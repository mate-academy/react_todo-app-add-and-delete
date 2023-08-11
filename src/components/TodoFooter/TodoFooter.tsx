import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { getCompletedTodos } from '../../services/todo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterStatus: FilterStatus,
  onFilterStatus: (filterStatus: FilterStatus) => void,
  removeTodo: (id: number) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterStatus,
  onFilterStatus,
  removeTodo,
}) => {
  const completedTodosCount = getCompletedTodos(todos).length;
  const activeTodosCount = todos.length - completedTodosCount;

  const isStatusChosen = (newStatus: FilterStatus) => {
    return newStatus === filterStatus;
  };

  const handleFilterChanging = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newStatus: FilterStatus,
  ) => {
    event.preventDefault();

    if (!isStatusChosen(newStatus)) {
      onFilterStatus(newStatus);
    }
  };

  const handleClearingCompleted = () => {
    todos.forEach(todo => todo.completed && removeTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: isStatusChosen(FilterStatus.All) },
          )}
          onClick={(event) => (
            handleFilterChanging(event, FilterStatus.All)
          )}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: isStatusChosen(FilterStatus.Active) },
          )}
          onClick={(event) => (
            handleFilterChanging(event, FilterStatus.Active)
          )}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: isStatusChosen(FilterStatus.Completed) },
          )}
          onClick={(event) => (
            handleFilterChanging(event, FilterStatus.Completed)
          )}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          { hidden: !completedTodosCount },
        )}
        onClick={handleClearingCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
