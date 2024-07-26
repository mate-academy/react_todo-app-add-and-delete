import { Todo } from '../types/Todo';
import { ErrorTypes } from '../types/ErrorTypes';
import { useEffect, useRef, useState } from 'react';

interface Props {
  createTodo: (todo: Todo) => Promise<void>;
  loading: number[] | null;
  setLoading: (val: number[] | null) => void;
  showNewError: (str: string) => void;
}

export const Header: React.FC<Props> = ({
  createTodo,
  loading,
  setLoading,
  showNewError,
}) => {
  const [title, setTitle] = useState('');
  const newTodoFieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoFieldFocus.current) {
      newTodoFieldFocus.current.focus();
    }
  }, [loading]);

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      showNewError(ErrorTypes.Empty);
      setLoading(null);

      return;
    }

    const todo: Todo = {
      id: 0,
      userId: 1113,
      completed: false,
      title: normalizeTitle,
    };

    try {
      setLoading([todo.id]);
      await createTodo(todo);
      reset();
    } catch (error) {
    } finally {
      setLoading(null);
    }
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
          ref={newTodoFieldFocus}
          value={title}
          disabled={!!loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
