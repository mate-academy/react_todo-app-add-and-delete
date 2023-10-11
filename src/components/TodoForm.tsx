type TodoAddFormProps = {
  title: string;
  isLoading: boolean;
  setTitle: (string: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoForm: React.FC<TodoAddFormProps> = ({
  title,
  isLoading,
  setTitle,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <input
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={title}
      onChange={(event) => {
        setTitle(event.target.value);
      }}
      disabled={isLoading}
      ref={input => input && input.focus()}
    />
  </form>
);
