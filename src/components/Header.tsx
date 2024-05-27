import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddingTodo: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
  handleTypingTodo: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  handleAddingTodo,
  title,
  handleTypingTodo,
}) => {
  const allTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddingTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleTypingTodo}
        />
      </form>
    </header>
  );
};
