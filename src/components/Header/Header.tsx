import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  completedTask: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddTodo: () => void;
  todoTitle: string;
  isLoading: boolean;
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  handleChange,
  handleAddTodo,
  todoTitle,
  isLoading,
  inputRef,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <header className="header">
      <input
        data-cy="NewTodoField"
        type="text"
        name="title"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        ref={inputRef}
      />
    </header>
  );
};
