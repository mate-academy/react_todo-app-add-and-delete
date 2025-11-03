import { useState } from 'react';
import cn from 'classnames';

type Props = {
  activeTodosCount: number;
  createTodo: (title: string, clearTitle: () => void) => void;
  isCreating: boolean;
  mainField: React.RefObject<HTMLInputElement>;
};

export const AddBar = ({
  activeTodosCount,
  createTodo,
  isCreating,
  mainField,
}: Props) => {
  const [title, setTitle] = useState<string>('');

  const clearInput = () => setTitle('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTodo(title, clearInput);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: activeTodosCount === 0,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isCreating}
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={mainField}
        />
      </form>
    </header>
  );
};
