import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (event: React.FormEvent) => void;
  todos: Todo[];
  handleToggleTodo: (todo: Todo) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const Header: React.FC<HeaderProps> = ({
  newTodo,
  setNewTodo,
  handleAddTodo,
  todos,
  handleToggleTodo,
  loading,
  inputRef,
}) => {
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [inputRef, loading]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
        onClick={() => todos.forEach(todo => handleToggleTodo(todo))}
        disabled={loading || todos.length === 0}
      />
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          ref={inputRef}
          disabled={loading}
        />
      </form>
    </header>
  );
};

export default Header;
