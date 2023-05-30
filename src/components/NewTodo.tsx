interface NewTodoProps {
  todoText: string;
  onTodoTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNewTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
}

export const NewTodo: React.FC<NewTodoProps> = ({
  todoText,
  onTodoTextChange,
  onNewTodoSubmit,
  isInputDisabled,
}) => {
  return (
    <form onSubmit={onNewTodoSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoText}
        onChange={onTodoTextChange}
        disabled={isInputDisabled}
      />
    </form>
  );
};
