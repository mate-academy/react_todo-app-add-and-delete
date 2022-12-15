import classNames from 'classnames';
import { Filter } from '../Filter';
import { Todo } from '../../types/Todo';

type Props = {
  status: string,
  setStatus: (status: string) => void,
  activeTodos: Todo[],
  onClear: () => Promise<void>;
  completedTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  status, setStatus, activeTodos, onClear, completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <Filter status={status} setStatus={setStatus} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden': !completedTodos.length,
          },
        )}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
