import React from 'react';
import cn from 'classnames';

type Props = {
  isActiveToggleAllActive: boolean,
  isVisibleToggleAllActive: boolean,
  title: string,
  onInputTitle: (todoTitle: string) => void,
  onAddTodo: (title: string) => void,
  onAddError: (error: string) => void,
};

export const TodoHeader: React.FC<Props> = ({
  isActiveToggleAllActive,
  isVisibleToggleAllActive,
  title,
  onInputTitle,
  onAddTodo,
  onAddError,
}) => {
  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputTitle(event.target.value);
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onAddError('Title can\'t be empty');

      return;
    }

    onAddTodo(title);
  };

  return (
    <header className="todoapp__header">
      {isVisibleToggleAllActive && (
        <button
          aria-label="toggle-all active"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isActiveToggleAllActive,
          })}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputTitle}
        />
      </form>
    </header>
  );
};
