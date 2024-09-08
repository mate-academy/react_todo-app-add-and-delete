import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  todoTitle: string;
  setTodoTitle: (title: string) => void;
  formSubmit: (event: React.FormEvent) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

const Header: React.FC<Props> = ({
  todos,
  todoTitle,
  setTodoTitle,
  formSubmit,
  isAdding,
  inputRef,
}) => {
  const allTodosCompleted = todos.every(todo => todo.completed);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={formSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={todoTitle}
          onChange={handleChangeTitle}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default Header;
