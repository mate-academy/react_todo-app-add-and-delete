type Props = {
  anyCompleted: boolean;
  onDeleteAllCompleted: () => void;
};

export const TodoFooterButton: React.FC<Props> = ({
  anyCompleted,
  onDeleteAllCompleted,
}) => {
  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!anyCompleted}
      onClick={onDeleteAllCompleted}
    >
      Clear completed
    </button>
  );
};
