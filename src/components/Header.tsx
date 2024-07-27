import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  newTodo: Omit<Todo, 'id'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  newTodo,
  onChange,
  onBlur,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo.title}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
