import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { deleteTodo } from '../api/todos';

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

  //
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
          showErrorNotification('Unable to delete a todo');
        }
      });
  };
  //

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            filtredByStatus === Status.all
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => setFiltredByStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            filtredByStatus === Status.active
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setFiltredByStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            filtredByStatus === Status.completed
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFiltredByStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
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
