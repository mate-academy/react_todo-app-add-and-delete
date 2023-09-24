/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  todos: Todo[];
  setErrorMessage: (message: string) => void;
  userId: number;
  isLoading: boolean;
  newTitle: string;
  setNewTitle: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  setErrorMessage = () => { },
  userId,
  isLoading,
  newTitle,
  setNewTitle = () => { },
}) => {
  // #region state
  const inputReference = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputReference.current && !isLoading) {
      inputReference.current.focus();
    }
  }, [isLoading]);
  // #endregion

  // #region handlers
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    onSubmit({
      id: 0, userId, title: newTitle.trim(), completed: false,
    });
  };
  // #endregion

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          disabled={isLoading}
          ref={inputReference}
          onChange={handleTitleChange}
          value={newTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
