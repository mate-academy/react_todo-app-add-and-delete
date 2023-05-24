interface Props {
  title: string;
  setTitle: (title: string) => void;
  addTodo: () => void;
  isLoading: boolean;
  setIsLoading: (boolean: boolean) => void;
}

export const AddTodoInput: React.FC<Props> = ({
  addTodo,
  title,
  setTitle,
  isLoading,
  setIsLoading,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typedInput: string = event.target.value;

    setTitle(typedInput);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    addTodo();
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
        disabled={isLoading}
      />
    </form>
  );
};
