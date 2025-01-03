import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type HeaderProps = {
  todosDb: Todo[];
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  inputLoading: boolean;
  addTodo: (e: React.FormEvent<HTMLFormElement>, title: string) => void;
};

const Header: React.FC<HeaderProps> = ({
  todosDb,
  newTodoTitle,
  setNewTodoTitle,
  inputLoading,
  addTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todosDb.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={e => addTodo(e, newTodoTitle)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={inputLoading}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;
