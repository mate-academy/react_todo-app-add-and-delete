import classNames from 'classnames';
import { useState } from 'react';

interface Props {
  onAddTodo: (title: string) => Promise<boolean>;
  allCompleted: boolean;
  onToggleAll: () => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const Header: React.FC<Props> = ({
  onAddTodo,
  allCompleted,
  onToggleAll,
  isInputDisabled,
  inputRef,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onAddTodo(newTitle);

    if (success) {
      setNewTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        aria-label="Toggle all todos"
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          autoComplete="off"
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default Header;
