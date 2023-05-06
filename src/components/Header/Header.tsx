type Props = {
  changeTitle: (value: string) => void;
  onAddTodo: (value: string) => void;
  titleTodos: string;
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  changeTitle,
  titleTodos,
}) => {
  const onSubmitTodo = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddTodo(titleTodos);
  };

  return (
    <div>
      <header className="todoapp__header">

        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="toggle-all"
        />

        <form onSubmit={onSubmitTodo}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={titleTodos}
            onChange={(e) => changeTitle(e.target.value)}
          />
        </form>
      </header>
    </div>
  );
};
