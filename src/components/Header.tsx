import { useState } from 'react';
import cn from 'classnames';

type Props = {
  isAllCompleted: boolean;
  addNewTodo: (title: string) => Promise<unknown>;
  setError: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  addNewTodo,
  setError,
  inputRef,
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodo.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    try {
      setLoadingData(true);
      await addNewTodo(trimmedTitle);
      setNewTodo('');
    } catch (error) {
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllCompleted })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={newTodo}
          placeholder="What needs to be done?"
          disabled={loadingData}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setNewTodo(event.target.value)
          }
        />
      </form>
    </header>
  );
};
