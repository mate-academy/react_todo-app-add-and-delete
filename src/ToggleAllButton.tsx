import React from 'react';

type Props = {
  isAllCompleted: boolean;
  todosCount: number;
  onToggleAll: () => void;
};

export const ToggleAllButton: React.FC<Props> = ({
  isAllCompleted,
  todosCount,
  onToggleAll,
}) => {
  return (
    <button
      type="button"
      className={`todoapp__toggle-all${isAllCompleted ? ' active' : ''}`}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
      disabled={todosCount === 0}
      aria-label="Toggle all todos"
    />
  );
};
