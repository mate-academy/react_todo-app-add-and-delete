/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  input: string
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void
  onCheckAllTodos: () => void
  handleImputTodo: (e: React.ChangeEvent<HTMLInputElement>) => void
};

export const Header: React.FC<Props> = ({
  todos,
  input,
  addTodo,
  onCheckAllTodos,
  handleImputTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${todos.length > 0 && 'active'}`}
        onClick={onCheckAllTodos}
      />

      <form onSubmit={addTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={handleImputTodo}
        />
      </form>
    </header>
  );
};
