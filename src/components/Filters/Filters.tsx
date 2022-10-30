import classnames from 'classnames';
import { FilterStatus } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { ErrorText } from '../ErrorNotification/ErrorNotification';

type Props = {
  todos: Todo[];
  filterType: string;
  handleFilterStatus: (type: string) => void;
  setTodos: (todos: Todo[]) => void;
  setError: (value: ErrorText) => void;
  completedTodosIds: Todo[],
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  handleFilterStatus,
  setTodos,
  setError,
  completedTodosIds,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  const deleteFinishedTodos = async (finished: Todo[]) => {
    try {
      finished.forEach(async (todo) => {
        await deleteTodo(todo.id);

        setTodos([...activeTodos]);
      });
    } catch {
      setError(ErrorText.Delete);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterStatus.All },
          )}
          onClick={() => handleFilterStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterStatus.Active },
          )}
          onClick={() => handleFilterStatus(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterStatus.Completed },
          )}
          onClick={() => handleFilterStatus(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteFinishedTodos(completedTodosIds)}
      >
        Clear completed
      </button>
    </footer>
  );
};
