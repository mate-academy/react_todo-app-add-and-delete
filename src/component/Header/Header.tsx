import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
type Props = {
  todos: Todo[];
  newTodo: string;
  setNewTodo: (newTodo: string) => void;
  loading: boolean;
  handleAddTodo?: (event: React.FormEvent) => void;
  loadTodos?: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodo,
  setNewTodo,
  loading,
  handleAddTodo,
  loadTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  return (
    <header className="todoapp__header">
      {/* + this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={() => loadTodos}
      />
      {/* +Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
