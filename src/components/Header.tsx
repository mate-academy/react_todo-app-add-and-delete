import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Omit<Todo, 'id'>;
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  onChange: (value: string) => void;
  onReset: () => void;
  onError: (error: string) => void;
};

export const Header: React.FC<Props> = ({
  todo,
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
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onError('');
    event.preventDefault();

    if (!todo.title.trim()) {
      onError('Title should not be empty');

      return;
    }

    setLoading(true);
    onSubmit(todo)
      .then(() => {
        onReset();
        titleField.current?.focus();
      })
      .finally(() => setLoading(false));
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
          value={todo.title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          disabled={loading ? true : false}
        />
      </form>
    </header>
  );
};
