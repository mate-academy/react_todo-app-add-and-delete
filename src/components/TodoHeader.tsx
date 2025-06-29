import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (title: string) => void;
  todos: Todo[];
  disabled: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  onAdd,
  todos,
  disabled,
  inputValue,
  setInputValue,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(inputValue);

    inputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.every(todo => todo.completed) && `active`}`}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={disabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
