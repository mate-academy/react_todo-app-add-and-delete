import classNames from 'classnames';
import { Condition } from '../types/Condition';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setFilterType: (filterType: Condition) => void;
  onDelete: (todoId: number) => void,
};

export const Footer: React.FC<Props> = ({ todos, setFilterType, onDelete }) => {
  const todosNotCompleted = todos.filter(todo => !todo.completed);
  const todosCompleted = todos.filter(todo => todo.completed);

  const removeCompleted = () => {
    todosCompleted.map(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosNotCompleted.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: Condition.All,
          })}
          onClick={() => setFilterType(Condition.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: Condition.Active,
          })}
          onClick={() => setFilterType(Condition.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: Condition.Completed,
          })}
          onClick={() => setFilterType(Condition.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed-hide': !todosCompleted.length,
        })}
        onClick={removeCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
