import React from 'react';
import { NewTodo } from '../NewTodo';

type Props = {
  onTodoAdd: (todoTitle: string) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({ onTodoAdd }) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <NewTodo onTodoAdd={onTodoAdd} />
    </header>
  );
};
