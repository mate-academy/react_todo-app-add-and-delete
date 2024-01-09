import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { deleteTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  todos: Todo[];
  setFiltredByStatus: (value: Status) => void;
  filtredByStatus: Status;
  setTodos: (value: Todo[]) => void;
  showErrorNotification: (value: string) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setFiltredByStatus,
  filtredByStatus,
  setTodos,
  showErrorNotification,
}) => {
  const itemsLeft = todos.filter((todo) => todo.completed === false).length;
  const handleClearCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const deletePromises = completedTodos.map((todo) => {
      return new Promise((resolve) => {
        deleteTodo(todo.id)
          .then(() => resolve(todo.id))
          .catch(() => resolve(null));
      });
    });

    Promise.all(deletePromises)
      .then((completedIds) => {
        const successfulDeletions = completedIds.filter((id) => id !== null);
        const updatedTodos = todos.filter(
          (todo) => !completedTodos.find((ct) => ct.id === todo.id),
        );

        setTodos(updatedTodos);

        if (successfulDeletions.length < completedTodos.length) {
          showErrorNotification(Errors.UNABLE);
        }
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            filtredByStatus === Status.ALL
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => setFiltredByStatus(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            filtredByStatus === Status.ACTIVE
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setFiltredByStatus(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            filtredByStatus === Status.COMPLETED
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFiltredByStatus(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed hidden"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todos.some((tod) => tod.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
