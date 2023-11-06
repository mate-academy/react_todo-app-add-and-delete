import { useEffect, useRef, useState } from 'react';
import { postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  userId: number;
  setTodos: (value: Todo[]) => void;
  currentTodos: Todo[];
  setErrorMessage: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  userId,
  setTodos,
  currentTodos,
  setErrorMessage,
}) => {
  const [query, setQuery] = useState('');

  const createTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (createTodo.current) {
      createTodo.current.focus();
    }
  }, []);

  const handleCreateTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setQuery('');
    postTodo({
      title: query,
      userId,
      completed: false,
    })
      .then(newTodo => {
        setTodos([...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        data-cy="ToggleAllButton"
        aria-label="toggle button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleCreateTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          ref={createTodo}
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
