type Props = {
  title: string,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TemporaryTodo: React.FC<Props> = ({ title }) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          title="status"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
      >
        x
      </button>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
