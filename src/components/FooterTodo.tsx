import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  activeTodos: number;
  sorted: string;
  setSorted: (value: string) => void;
  todos: Todo[];
  onDeleteAll: () => void;
}
export const FooterTodo: React.FC<Props> = ({
  activeTodos,
  sorted,
  setSorted,
  todos,
  onDeleteAll,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: sorted === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSorted('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: sorted === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSorted('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: sorted === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSorted('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteAll}
        disabled={!todos.some(t => t.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
