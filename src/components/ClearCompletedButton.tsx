export const ClearCompletedButton: React.FC<{
  onClearCompleted: () => void;
  isClearingCompleted: boolean;
  hasCompletedTodo: boolean;
}> = ({ onClearCompleted, isClearingCompleted, hasCompletedTodo }) => (
  <button
    type="button"
    className="todoapp__clear-completed"
    data-cy="ClearCompletedButton"
    disabled={!hasCompletedTodo || isClearingCompleted}
    aria-disabled={!hasCompletedTodo}
    onClick={onClearCompleted}
  >
    Clear completed
  </button>
);
