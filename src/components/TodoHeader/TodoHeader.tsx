import { useEffect, useState } from 'react';
import { Errors } from '../../types/ErrorType';

interface Props {
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors | null>>;
  onAddTodo: (title: string) => Promise<void>;
  field: React.RefObject<HTMLInputElement>;
}

export const TodoHeader: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  setErrorMessage,
  onAddTodo,
  field,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle.trim() === '') {
      setErrorMessage(Errors.EmptyTitle);

      setTimeout(() => setErrorMessage(null), 3000);

      return;
    }

    try {
      setIsLoading(true);
      await onAddTodo(newTitle.trim());
    } catch (error) {
    } finally {
      setIsLoading(false);
      field.current?.focus();
    }
  };

  useEffect(() => {
    field.current?.focus();
  }, [isLoading, newTitle, field]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={field}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
