import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  onAdd: (newTodo: Todo) => Promise<void>;
  setError: (error: Errors | null) => void;
  processing: number;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onAdd,
  setError,
  processing,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      setError(Errors.Empty);

      return;
    }

    onAdd({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    }).then(() => setTitle(''));
  };

  useEffect(() => {
    if (inputRef.current && processing === -1) {
      inputRef.current.focus();
    }
  }, [processing]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleTitleChange}
          disabled={processing !== -1}
        />
      </form>
    </header>
  );
};
