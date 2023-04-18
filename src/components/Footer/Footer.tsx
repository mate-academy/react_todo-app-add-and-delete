import { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from './components/Filter';

interface Props {
  todos: Todo[];
  status: string;
  handleClearCompleted: () => void;
  setStatus: (value: string) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  handleClearCompleted,
}) => {
  const isActiveTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${isActiveTodos.length} items left`}
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
