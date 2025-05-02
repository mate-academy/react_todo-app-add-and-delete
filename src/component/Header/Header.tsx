// import React, { useState } from 'react';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setError: (error: string) => void;
  onSubmit: (todo: Todo) => Promise<void>;
  setTodo: (todo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setError,
  setTodo,
  onSubmit,
}) => {
  const [query, setQuery] = useState('');
  // const [inputDisabled, setInputDisabled] = useState(false);

  const reset = () => {
    setQuery('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setError('Title should not be empty');

      return;
    }

    setTodo({
      id: 0,
      userId: 2816,
      title: query,
      completed: false,
    });

    onSubmit({
      id: 0,
      userId: 2816,
      title: query,
      completed: false,
    }).then(reset);
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
          disabled={false}
          autoFocus
        />
      </form>
    </header>
  );
};
