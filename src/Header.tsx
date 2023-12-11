import { useEffect, useRef, useState } from 'react';
import { addTodos } from './api/todos';
import { Todo } from './types/Todo';

type Props = {
  setErrorMessage: (error: string) => void;
  userId: number;
  setTodos: (todo: Todo[]) => void;
  setTempTodo: (todo: Todo | null) => void;
  todos: Todo[];
  temp: Todo | null;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  userId,
  setTodos,
  setTempTodo,
  todos,
  temp,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [temp]);

  const handleInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      userId,
      title: title.trim(),
      completed: false,
    };

    const temTodo = {
      id: 0,
      userId,
      title: title.trim(),
      completed: false,
    };

    setIsLoading(true);

    setTempTodo(temTodo);

    addTodos(newTodo)
      .then((todo) => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTitle(title.trim());
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="toggleALL"
      />

      <form onSubmit={handleInput}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
