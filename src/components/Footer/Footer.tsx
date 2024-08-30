/* eslint-disable @typescript-eslint/indent */
import classNames from 'classnames';
import { Status } from '../../utils/helpers';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { errorMessages } from '../../utils/const';

type Props = {
  todos: Todo[];
  selectedFilter: Status;
  setSelectedFilter: (filter: Status) => void;
  setError: React.Dispatch<
    React.SetStateAction<{ hasError: boolean; message: string }>
  >;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  setError,
  setTodos,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    Promise.allSettled(completedTodos.map(todo => deleteTodos(todo.id)))
      .then(results => {
        const successfulDeletions = completedTodos.filter(
          (_todo, index) => results[index].status === 'fulfilled',
        );

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulDeletions.includes(todo)),
        );

        const failedDeletions = completedTodos.filter(
          (_todo, index) => results[index].status === 'rejected',
        );

        if (failedDeletions.length > 0) {
          setError({ hasError: true, message: errorMessages.deleteError });
        }
      })
      .catch(() => {
        setError({ hasError: true, message: errorMessages.deleteError });
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Status.completed)}
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
