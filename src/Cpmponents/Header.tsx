import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  completedTask: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddTodo: () => void;
  todoTitle: string;
  isLoading: boolean;
};

const Header: React.FC<Props> = ({
  completedTask,
  handleChange,
  handleAddTodo,
  todoTitle,
  isLoading,
  todos,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTodo();
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: completedTask })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="title"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleChange}
          disabled={isLoading}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;
