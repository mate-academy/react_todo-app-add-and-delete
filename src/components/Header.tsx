/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { ChangeEvent, FormEvent } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodoTitle: string,
  onNewTitleAdd: (event: ChangeEvent<HTMLInputElement>) => void;
  createNewTodo: (event: FormEvent<HTMLFormElement>) => void,
  activeTodos: Todo[],
  areTodosLoading: boolean,
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  onNewTitleAdd,
  createNewTodo,
  activeTodos,
  areTodosLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all active',
          { active: activeTodos.length > 0 },
        )}
      />
      <form onSubmit={createNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onNewTitleAdd}
          disabled={areTodosLoading}
        />
      </form>
    </header>
  );
};
