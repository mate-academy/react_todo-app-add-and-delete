/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uncompletedTodos: Todo[]
  tempTodo: Todo | null;
  todoTitle: string;
}

export const TodoHeader: React.FC<Props> = ({
  handleSubmit,
  handleTodoTitle,
  uncompletedTodos,
  tempTodo,
  todoTitle,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all',
          { active: uncompletedTodos.length !== 0 })}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTodoTitle}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
