interface TodoLoaderProps {
  loading: boolean;
}

export const TodoLoader: React.FC<TodoLoaderProps> = ({ loading }) => {
  return (
    /* 'is-active' class puts this modal on top of the todo */
    <div
      data-cy="TodoLoader"
      className={`modal overlay ${loading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
