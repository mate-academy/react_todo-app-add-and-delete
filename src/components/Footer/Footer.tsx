import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

import cn from 'classnames';

type Props = {
  todos: Todo[];
  setStatusOfTodos: (Status: Status) => void;
  statusOfTodos: Status;
  deleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setStatusOfTodos,
  statusOfTodos,
  deleteCompletedTodo,
}) => {
  const completTodo = todos.filter(todo => todo.completed);
  const notCompletTodo = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletTodo.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: statusOfTodos === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatusOfTodos(Status.all)}
        >
          {Status.all}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: statusOfTodos === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatusOfTodos(Status.active)}
        >
          {Status.active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: statusOfTodos === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatusOfTodos(Status.completed)}
        >
          {Status.completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompletedTodo}
        disabled={!completTodo.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
