import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  todos: Todo[];
  newTodos: string;
  setNewTodos: (value: string) => void;
  handleAddTodo: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isSubmitting: boolean;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  newTodos,
  setNewTodos,
  handleAddTodo,
  inputRef,
  isSubmitting,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed) ? 'is-active' : '',
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodos}
          onChange={e => setNewTodos(e.target.value)}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
