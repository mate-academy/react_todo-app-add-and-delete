interface Props {
  title: string;
  handleTitle: (title: string) => void,
  addTodo: () => void;
  isLoading: boolean;
  setIsLoading: (boolean: boolean) => void;
}

export const AddTodoForm: React.FC<Props> = ({
  title,
  handleTitle,
  addTodo,
  isLoading,
  setIsLoading,
}) => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    addTodo();
    setIsLoading(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => handleTitle(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
