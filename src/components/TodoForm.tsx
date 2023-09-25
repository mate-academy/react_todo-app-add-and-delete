import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onTodoAdd: (todoTitle: string) => Promise<void>;
  onTodoError: (value: string) => void;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onTodoAdd,
  onTodoError,
}) => {
  const isTodosToShow = !!todos.length;
  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const preparedTitle = title.trim();

    if (!preparedTitle) {
      onTodoError('Title should not be empty');

      return;
    }

    onTodoAdd(preparedTitle)
      .then(() => setTitle(''));
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {isTodosToShow && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="New Todo"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
