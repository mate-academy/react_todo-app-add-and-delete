export const TodoEditing = () => (
  <form>
    <input
      data-cy="TodoTitleField"
      type="text"
      className="todo__title-field"
      placeholder="Empty todo will be deleted"
      value="Todo is being edited now"
    />
  </form>
);
