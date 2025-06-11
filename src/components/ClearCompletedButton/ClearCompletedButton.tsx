interface ClearCompletedButtonProps {
  todoCompleted: boolean;
  handleClearCompletedButton: () => void;
}

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({
  todoCompleted,
  handleClearCompletedButton,
}) => {
  return (
    /* this button should be disabled if there are no completed todos */
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!todoCompleted}
      onClick={handleClearCompletedButton}
    >
      Clear completed
    </button>
  );
};
