/* eslint-disable react/self-closing-comp */
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';

type Props = {
  status: Status;
  onChangeStatus: React.Dispatch<React.SetStateAction<Status>>;
  activeTodos: Todo[];
  onClear: () => Promise<void>
};

export const Footer: React.FC<Props> = ({
  status,
  onChangeStatus,
  activeTodos,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <TodoFilter status={status} onChangeStatus={onChangeStatus} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden': !activeTodos.length,
          },
        )}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
