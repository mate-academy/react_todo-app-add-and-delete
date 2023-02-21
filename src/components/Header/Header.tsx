import React, { FormEvent, useEffect, useRef } from 'react';

type Props = {
  onAddTodo: (title: string) => void,
  todoTitle: string,
  setTodoTitle: (todoTitle: string) => void,
  isBeingLoading: boolean,
  showExpendIcon: boolean,
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  todoTitle,
  setTodoTitle,
  isBeingLoading,
  showExpendIcon,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onAddTodo(todoTitle);
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isBeingLoading]);

  return (
    <header className="todoapp__header">
      {showExpendIcon
        && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            type="button"
            className="todoapp__toggle-all active"
          />
        )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={isBeingLoading}
        />
      </form>
    </header>
  );
};
