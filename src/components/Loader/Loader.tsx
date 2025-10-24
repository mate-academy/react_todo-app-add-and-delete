export const Loader: React.FC = () => {
  return (
    <div data-cy="Todo" className="todo">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        id="loader-todo-status"
      />
      <span className="todo__custom-checkbox" />
      <div className="todo__title">Loading...</div>
    </div>
  );
};
