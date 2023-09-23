import classNames from 'classnames';
import { useContext } from 'react';
import { TodoStatus } from '../../types';
import { TodoContext } from '../../TodoContext';

type Props = {
  selectStatus: (status: TodoStatus) => void;
  status: TodoStatus;
};

export const TodoFilter: React.FC<Props> = ({
  selectStatus,
  status,
}) => {
  const {
    completedTodos,
    clearAllCompleted,
    uncompletedTodosLength,
  } = useContext(TodoContext);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosLength} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.entries(TodoStatus).map(([key, value]) => (
          <a
            key={key}
            href={`#/${value}`}
            className={classNames(
              'filter__link', {
                selected: value === status,
              },
            )}
            onClick={() => selectStatus(value as TodoStatus)}
            data-cy={`FilterLink${key}`}
          >
            {key}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: completedTodos.length ? 'visible' : 'hidden' }}
        onClick={clearAllCompleted}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
