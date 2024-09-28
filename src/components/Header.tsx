import { useEffect } from 'react';
import { useRef } from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  onChange: () => void;
  onAddTodo: () => Promise<void>;
  title: string;
  setTitle: (string: string) => void;
  isSubmitting: boolean;
  error: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  onChange,
  onAddTodo,
  title,
  setTitle,
  isSubmitting,
  error,
}) => {
  const completedTodo = todos.filter(todo => todo.completed).length;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTodo();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, error]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${completedTodo ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onChange}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
