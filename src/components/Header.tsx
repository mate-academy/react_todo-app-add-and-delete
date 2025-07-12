import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  inputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onAddTodo: () => void;
  onInputChange: (value: string) => void;
  inputValue: string;
};

export const Header: React.FC<Props> = ({
  todos,
  inputDisabled,
  onAddTodo,
  inputRef,
  onInputChange,
  inputValue,
}) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddTodo();
  }

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', false && 'active')}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={inputDisabled}
          onChange={event => onInputChange(event.target.value)}
          value={inputValue}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
        />
      </form>
    </header>
  );
};
