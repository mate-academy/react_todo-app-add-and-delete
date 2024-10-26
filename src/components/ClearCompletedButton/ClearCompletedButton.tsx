type Props = {
  completedCount: number;
  clearCompleted: () => void;
};

export const ClearCompletedButton: React.FC<Props> = ({
  completedCount,
  clearCompleted,
}) => {
  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedCount === 0}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  );
};
