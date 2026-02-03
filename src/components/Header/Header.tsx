import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface PropsHeader {
  todos: Todo[];
  onCreate: (value: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  onTitle: (value: string) => void;
  isCreating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<PropsHeader> = ({
  todos,
  onCreate,
  title,
  onTitle,
  isCreating,
  inputRef,
}) => {
  const everyTodo = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: everyTodo })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onCreate}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onTitle(e.target.value)}
          disabled={isCreating}
        />
      </form>
    </header>
  );
};
