import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

type Props = {
  todos: Todo[];
  setStatus: (status: string) => void;
  status: string;
  deleteCompletedTodos: (todos: Todo[]) => void;
};

const getDataCYByStatus = (status: string) => {
  switch (status) {
    case Object.keys(Status)[Object.values(Status).indexOf(Status.active)]:
      return 'FilterLinkActive';
    case Object.keys(Status)[Object.values(Status).indexOf(Status.completed)]:
      return 'FilterLinkCompleted';
    default:
      return 'FilterLinkAll';
  }
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setStatus,
  status,
  deleteCompletedTodos,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const handleTodosStatus = (currentStatus: string) => {
    setStatus(currentStatus);
  };

  const isOneComplited =
    todos.filter(todo => todo.completed).length > 0 ? false : true;

  const handleDeleteAllCompleted = () => {
    deleteCompletedTodos(todos.filter(t => t.completed === true));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.entries(Status).map(([key, value]) => (
          <a
            key={key}
            href="#/"
            className={classNames('filter__link', {
              selected: status === key,
            })}
            data-cy={getDataCYByStatus(key)}
            onClick={() => handleTodosStatus(key)}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        disabled={isOneComplited}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
