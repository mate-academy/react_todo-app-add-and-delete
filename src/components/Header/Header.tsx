import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[];
  handleAddTodo: (query: string) => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({ handleAddTodo, todos }) => {
  const [query, setQuery] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const newTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoInput.current) {
      newTodoInput.current.focus();
    }
  }, [todos, isDisabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsDisabled(true);

    handleAddTodo(query.trim())
      .then(() => {
        setQuery('');
      })
      .catch(() => {})
      .finally(() => setIsDisabled(false));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          ref={newTodoInput}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
