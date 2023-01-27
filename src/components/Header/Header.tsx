/* eslint-disable jsx-a11y/control-has-associated-label */
import { memo, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  onAddTodo: (newTitle: string) => Promise<void>;
  isAdding: boolean,
  showError: (message: string) => void;
}

export const Header: React.FC<Props> = memo(({
  newTodoField,
  onAddTodo,
  isAdding,
  showError,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const submitTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      showError('Title can\'t be empty');
    }

    if (newTodoTitle.trim()) {
      onAddTodo(newTodoTitle);
      setNewTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={submitTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
