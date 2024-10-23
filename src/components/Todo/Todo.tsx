/* eslint-disable jsx-a11y/label-has-associated-control */
{
  /* This todo is an active todo */
}

<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
  </label>

  <span data-cy="TodoTitle" className="todo__title">
    Not Completed Todo
  </span>
  <button type="button" className="todo__remove" data-cy="TodoDelete">
    ×
  </button>

  <div data-cy="TodoLoader" className="modal overlay">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
</div>;

{
  /* This todo is being edited */
}

<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
  </label>

  {/* This form is shown instead of the title and remove button */}
  <form>
    <input
      data-cy="TodoTitleField"
      type="text"
      className="todo__title-field"
      placeholder="Empty todo will be deleted"
      value="Todo is being edited now"
    />
  </form>

  <div data-cy="TodoLoader" className="modal overlay">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
</div>;
