import { useMemo } from 'react';
import { GroupBy } from '../../types/GroupBy';
import { Todo } from '../../types/Todo';
import { Navigation } from '../Navigation/Navigation';

type Props = {
  todos: Todo[];
  groupBy: GroupBy;
  onGroup: (status: GroupBy) => void;
  onDeleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  groupBy,
  onGroup,
  onDeleteCompletedTodos,
}) => {
  const isTodoCompleted = useMemo(() => todos
    .some(({ completed }) => completed), [todos]);

  const uncompletedCount = useMemo(() => todos
    .filter(({ completed }) => !completed).length, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedCount} items left`}
      </span>

      <Navigation
        groupBy={groupBy}
        onGroup={onGroup}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: isTodoCompleted ? 'visible' : 'hidden' }}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
