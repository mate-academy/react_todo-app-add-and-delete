import React from 'react';

type Props = {
  handleClear: () => void;
  completed: number;
};

export const TodoClearButton: React.FC<Props> = ({
  completed,
  handleClear,
}) => {
  return (
    <div>
      {completed > 0 && (
        <button
          className="todoapp__clear-completed"
          type="button"
          onClick={handleClear}
        >
          Clear completed
        </button>
      )}
    </div>
  );
};
