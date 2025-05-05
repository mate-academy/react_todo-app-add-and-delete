import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setError: (error: string) => void;
  onSubmit: (todo: Todo) => Promise<void>;
  setTodo: (todo: Todo | undefined) => void;
  isDisabled: boolean;
  error: string;
};

export const Header: React.FC<Props> = ({
  todos,
  setError,
  onSubmit,
  isDisabled,
  error,
  // setTodo,
}) => {
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [query, error, todos]);

  const reset = () => {
    setQuery('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setError('');

    if (!query.trim()) {
      setError('Title should not be empty');

      return;
    }

    // setTodo({
    //   id: 0,
    //   userId: 2816,
    //   title: query,
    //   completed: false,
    // });

    onSubmit({
      id: 0,
      userId: 2816,
      title: query.trim(),
      completed: false,
    })
      .then(reset)
      .catch(() => {
        setError('Unable to add a todo');
      });
  };

  return (
    <header className="todoapp__header">
      {todos && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos?.filter(todo => todo.completed === true).length === todos.length ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          disabled={isDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
