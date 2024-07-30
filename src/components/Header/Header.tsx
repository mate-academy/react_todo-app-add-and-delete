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
        onKeyDown={event => {
          if (event.key === 'Enter') {
            handleAddTodo();
          }
        }}
        disabled={isLoading}
        ref={inputRef}
      />
    </header>
  );
};
