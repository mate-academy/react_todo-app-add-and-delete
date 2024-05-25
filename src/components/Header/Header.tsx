import React, { FormEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[];
  handleAddTodo: (event: FormEvent<HTMLFormElement>) => void;
  titleField: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  handleAddTodo,
  titleField,
  title,
  setTitle,
}) => {
  const allCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
