import { SetStateAction } from 'react';
import cn from 'classnames';

interface HeaderProps {
  isAllCompleted: boolean;
  handleSubmit: (event: React.FormEvent) => void;
  setNewTodoTitle: React.Dispatch<SetStateAction<string>>;
  newTodoTitle: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  isAllCompleted,
  handleSubmit,
  setNewTodoTitle,
  newTodoTitle,
  isLoading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value.trimStart())}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
