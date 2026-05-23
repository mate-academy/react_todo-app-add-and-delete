import { useRef, useEffect } from 'react';

type Props = {
  title: string;
  setTitle: (newTitle: string) => void;
  setErrorMessage: (newError: ErrorMessage) => void;
  isSubmiting: boolean;
  onAddTodo: (title: string) => void;
  deletingTodoIds: number[];
};
import { ErrorMessage } from '../types/Enum';

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  setErrorMessage,
  isSubmiting,
  onAddTodo,
  deletingTodoIds,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = title.trim();

    if (trimedTitle.length < 1) {
      return setErrorMessage(ErrorMessage.TitleEmpty);
    }

    onAddTodo(trimedTitle);
  };

  const apiFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmiting && deletingTodoIds.length === 0 && apiFieldRef.current) {
      apiFieldRef.current.focus();
    }
  }, [isSubmiting, deletingTodoIds]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmiting}
          ref={apiFieldRef}
        />
      </form>
    </header>
  );
};
