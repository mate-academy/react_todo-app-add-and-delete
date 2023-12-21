import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleSubmit: (event: React.FormEvent) => void;
  newTitle: string;
  pending: boolean;
  setNewTitle: (title: string) => void;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  handleSubmit,
  newTitle,
  pending,
  setNewTitle,
}) => {
  const textField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textField) {
      textField.current?.focus();
    }
  }, [todos.length]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={textField}
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        disabled={pending}
      />
    </form>
  );
};
