import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  addTodo: ({ title, userId, completed }: Omit<Todo, 'id'>) => Promise<void>;
  isSubmiting: boolean;
};

export const Header: React.FC<Props> = ({ addTodo, isSubmiting }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmiting]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    const newTodo: Omit<Todo, 'id'> = {
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    return addTodo(newTodo).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => {}}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
