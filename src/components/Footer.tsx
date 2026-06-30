import React from 'react';

type Props = {
  completedCount: number;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  completedCount,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
