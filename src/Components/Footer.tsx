import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  setSelectedValue: (value: Status) => void;
  todosLeft: number;
  selectedValue: string;
  completedTodos: Todo[];
  deleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  setSelectedValue,
  todosLeft,
  selectedValue,
  completedTodos,
  deleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedValue === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedValue(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedValue === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedValue(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedValue === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedValue(Status.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
