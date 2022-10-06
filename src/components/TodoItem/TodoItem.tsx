type Props = {
  previewTitle: string;
};

export const TodoItem: React.FC<Props> = ({
  previewTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className="todo"
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {previewTitle}
        </span>
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
