type Props = {
  value: string;
};

export const TempTodo: React.FC<Props> = ({ value }) => {
  return (
    <div data-cy="Todo" className="todo" id="0">
      <label
        className="todo__status-label"
        aria-label={`Mark 'incomplete' & 'complete'}`}
      >
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {value}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
