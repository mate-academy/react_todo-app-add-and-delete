import { useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  addNewTodo: (title: string) => void;
  isAdding: boolean;
  showError: (message: Errors) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  addNewTodo,
  isAdding,
  showError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      showError(Errors.TITLE);
    } else {
      await addNewTodo(title);
      await setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        aria-label="Toggle All"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
