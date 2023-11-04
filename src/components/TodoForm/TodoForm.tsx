import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  onSubmit: (todo: Todo) => Promise<void> | null;
  userId: number;
}

export const TodoForm: React.FC<Props> = ({ onSubmit, userId }) => {
  const [newTodo, setNewTodo] = useState('');
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const submitResult = onSubmit({
      id: 0,
      userId,
      title: newTodo,
      completed: false,
    });

    if (submitResult instanceof Promise) {
      submitResult
        .then(() => setNewTodo(''))
        .catch((error) => {
          throw error;
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        ref={titleField}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
    </form>
  );
};
