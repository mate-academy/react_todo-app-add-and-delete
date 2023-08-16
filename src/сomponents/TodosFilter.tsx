import classNames from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  status: Filter;
  onChangeStatus: (filterStatus: Filter) => void;
  todos: Todo[];
  setTodosIdToDelete: (todosId: number[]) => void;
};

export const TodosFilter: React.FC<Props> = ({
  onChangeStatus,
  status,
  todos,
  setTodosIdToDelete,
}) => {
  const activeTodos = todos.reduce((sum, todo) => sum + +!todo.completed, 0);
  const haveCompleted = todos.some(todo => todo.completed === true);

  const handleClearCompleted = () => {
    setTodosIdToDelete(todos
      .filter(todo => todo.completed)
      .map(todo => todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            classNames('filter__link', { selected: status === Filter.all })
          }
          onClick={() => onChangeStatus(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames('filter__link', { selected: status === Filter.active })
          }
          onClick={() => onChangeStatus(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames(
              'filter__link',
              { selected: status === Filter.completed },
            )
          }
          onClick={() => onChangeStatus(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { hidden: !haveCompleted },
        )}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
