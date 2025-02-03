import cn from 'classnames';
import { RefObject, useState } from 'react';

type Props = {
  isAllTodosCompleted: boolean;
  isInputDisabled: boolean;
  onSubmit: (title: string, onSuccess: () => void) => void;
  saveAllTodos: () => void;
  setErrorMessage: (message: string) => void;
  inputRef: RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  isAllTodosCompleted,
  isInputDisabled,
  onSubmit,
  saveAllTodos,
  setErrorMessage,
  inputRef,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    onSubmit(newTodoTitle.trim(), () => setNewTodoTitle(''));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
        data-cy="ToggleAllButton"
        onClick={saveAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleNewTodoChange}
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
