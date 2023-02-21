type Props = {
  todoTitle: string;
  handleSubmit: (event: React.FormEvent) => void;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isInputDisabled: boolean;
};

export const AddTodoForm: React.FC<Props> = ({
  todoTitle,
  handleSubmit,
  handleInput,
  isInputDisabled,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInput}
        disabled={isInputDisabled}
      />
    </form>
  );
};
