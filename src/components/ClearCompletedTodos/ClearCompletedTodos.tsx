import React from 'react';

type Props = {
  hasCompleted: boolean;
  onDeleteAllCompleted: () => void;
};

export const ClearCompletedTodos: React.FC<Props> = React.memo(({
  hasCompleted,
  onDeleteAllCompleted,
}) => (
  <button
    data-cy="ClearCompletedButton"
    type="button"
    className="todoapp__clear-completed"
    style={{ width: '100px' }}
    onClick={onDeleteAllCompleted}
    disabled={!hasCompleted}
  >
    {hasCompleted
      ? 'Clear completed'
      : ''}
  </button>
));
