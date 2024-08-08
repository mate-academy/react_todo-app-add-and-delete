type Props = {
  onDelete: (id: number) => void;
  todoId: number;
};

export const TodoDeleteButton: React.FC<Props> = ({ onDelete, todoId }) => {
  return (
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(todoId)}
    >
      ×
    </button>
  );
};
