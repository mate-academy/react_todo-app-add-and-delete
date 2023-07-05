/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/todo';
import { TodoForm } from '../TodoForm';

interface Props {
  setError: (error: string) => void;
  onTodoAdd: (title: string) => void;
  tempTodo: Todo | null;
}

export const Header: React.FC<Props> = ({
  setError,
  onTodoAdd,
  tempTodo,
}) => (
  <header className="todoapp__header">
    {/* this buttons is active only if there are some active todos */}
    <button type="button" className="todoapp__toggle-all active" />

    {/* Add a todo on form submit */}
    <TodoForm setError={setError} onTodoAdd={onTodoAdd} tempTodo={tempTodo} />
  </header>
);
