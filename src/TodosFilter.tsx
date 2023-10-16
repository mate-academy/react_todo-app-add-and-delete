import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { deleteTodos } from './api/todos';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  status: Status,
  setStatus: Dispatch<SetStateAction<Status>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  setTodos,
  status,
  setStatus,
  setErrorMessage,
}) => {
  const todosNotCompleted = todos.filter(todo => !todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const clearCompleted = () => {
    const todosCompleted = todos.filter(todo => todo.completed);

    const todosIdCompleted = todosCompleted.map(todo => todo.id);

    todosIdCompleted.forEach(item => {
      deleteTodos(item)
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    });

    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  };

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {todosNotCompleted.length}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">

        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: status === Status.all,
          })}
          onClick={() => setStatus(Status.all)}
        >
          {Status.all}
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: status === Status.active,
          })}
          onClick={() => setStatus(Status.active)}
        >
          {Status.active}
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: status === Status.completed,
          })}
          onClick={() => setStatus(Status.completed)}
        >
          {Status.completed}
        </a>

      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
