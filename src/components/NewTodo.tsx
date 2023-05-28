interface NewTodoProps {
  todoText: string;
  handleChangeTodoText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
}

export const NewTodo: React.FC<NewTodoProps> = ({
  todoText,
  handleChangeTodoText,
  handleNewTodoSubmit,
  isInputDisabled,
}) => {
  return (
    <form onSubmit={handleNewTodoSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoText}
        onChange={handleChangeTodoText}
        disabled={isInputDisabled}
      />
    </form>
  );
};
