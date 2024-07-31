import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  onChange: (value: string) => void;
  onReset: () => void;
  onError: (error: string) => void;
};

export const Header: React.FC<Props> = ({
  title,
  todos,
  onSubmit,
  onChange,
  onReset,
  onError,
}) => {
  const titleField = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onError('');
    event.preventDefault();

    if (!title.trim()) {
      onError('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: 939,
      title: title.trim(),
      completed: false,
    };

    setLoading(true);
    onSubmit(newTodo)
      .then(() => {
        onReset();
        titleField.current?.focus();
      })
      .catch(() => {
        onError('Unable to add a todo');
      })
      .finally(() => {
        setLoading(false);
      });
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
          value={title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          disabled={loading}
        />
      </form>
    </header>
  );
};
