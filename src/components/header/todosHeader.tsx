import React from 'react';
import { Todo } from '../../types/Todo';

interface TodosHeaderProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  setInputValue: (title: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const TodosHeader: React.FC<TodosHeaderProps> = ({
  todos,
  tempTodo,
  inputValue,
  inputRef,
  setInputValue,
  onSubmit,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={e => onSubmit(e)}>
        <input
          ref={inputRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
