import { Todo } from '../types/Todo';

interface Props {
  query: string;
  setQuery: (event: string) => void;
  addPost: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodosForm: React.FC<Props> = ({
  query,
  setQuery,
  addPost,
  setErrorMessage,
  setIsLoading,
  isLoading,
  inputRef,
}) => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      title: query.trim(),
      userId: 0,
      completed: false,
    };

    // addPost(newTodo)
    //   .then(() => {
    //     setErrorMessage('');
    //   })
    //   .finally(() => {
    //     setQuery('');
    //     setIsLoading(false);
    //     inputRef.current?.focus();
    //   });

    try {
      setIsLoading(true);
      await addPost(newTodo);
      setQuery('');
      setErrorMessage('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        disabled={isLoading}
        value={query}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={event => setQuery(event.currentTarget.value)}
      />
    </form>
  );
};
