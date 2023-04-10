interface Props {
  todoId: number;
  onDelete: () => void;
}

export const DeleteTodo: React.FC<Props> = ({ onDelete }) => {
  return (
    <button
      type="button"
      className="todo__remove"
      onClick={onDelete}
    >
      ×
    </button>
  );
};
