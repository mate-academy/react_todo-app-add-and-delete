import { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { Filter } from './components/Filter';

interface Props {
  todos: Todo[];
  status: Status;
  handleClearCompleted: () => void;
  setStatus: (value: Status) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  handleClearCompleted,
}) => {
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <Filter
        status={status}
        setStatus={setStatus}
      />

      <button
        type="button"
        disabled={!hasCompleted}
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
