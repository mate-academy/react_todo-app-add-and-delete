import { Dispatch, FC } from 'react';

import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { deleteTodos } from '../api/todos';

interface Props {
  todos: Todo[];
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  setIsDeleting: Dispatch<React.SetStateAction<number>>;
  onErrorMessage: (message: string) => void;
}

const Footer: FC<Props> = ({
  todos,
  selectedStatus,
  setSelectedStatus,
  setTodos,
  setIsDeleting,
  onErrorMessage,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      setIsDeleting(todo.id);
      deleteTodos(todo.id)
        .then(() =>
          setTodos((prevState: Todo[]) =>
            prevState.filter(t => t.id !== todo.id),
          ),
        )
        .catch(() => onErrorMessage('Unable to delete a todo'))
        .finally(() => setIsDeleting(0));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${selectedStatus === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${selectedStatus === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${selectedStatus === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
