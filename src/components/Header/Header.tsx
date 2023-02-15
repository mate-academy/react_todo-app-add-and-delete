/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  createTodo: (title: string) => void,
  todoTitle: string,
  setTodoTitle: (title: string) => void,
};

export const Header: React.FC<Props> = ({
  createTodo,
  todoTitle,
  setTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      <button
        title="All"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        createTodo(todoTitle);
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
