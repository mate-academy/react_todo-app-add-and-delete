import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { TodoErrors } from '../types/TodoErrors';

interface Props {
  isInputDisabled: boolean;
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: string | null) => void;
}

export const Header: React.FC<Props> = ({
  onSubmit,
  isInputDisabled,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const focusRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trimStart());
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(TodoErrors.TitleEmpty);

      return;
    }

    onSubmit({
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(TodoErrors.UnableToAddTodo);
      });
  };

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={focusRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
