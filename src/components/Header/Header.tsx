import React, { memo } from 'react';
import cn from 'classnames';

interface HeaderProps {
  hasSomeActiveTodos: boolean;
  onAddTodo: (title: string) => void;
  onChangeNotification: (errorMessage: string) => void;
  isLoading: boolean;
  title: string;
  onChangeTitle: (title: string) => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  hasSomeActiveTodos,
  onAddTodo,
  onChangeNotification,
  isLoading,
  title,
  onChangeTitle,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onChangeNotification('Title can\'t be empty');

      return;
    }

    onAddTodo(title);
  };

  return (
    <header className="todoapp__header">
      {hasSomeActiveTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all', {
              active: hasSomeActiveTodos,
            },
          )}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
