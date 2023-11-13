import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  onSubmit: (todo: Todo) => Promise<void> | null;
  userId: number;
  todos: Todo[];
}

export const TodoForm: React.FC<Props> = ({ onSubmit, userId, todos }) => {
  const [newTodo, setNewTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const todo: Todo = {
      id: 0,
      userId,
      title: newTodo,
      completed: false,
    };

    setIsSubmitting(true);
    const submitResult = onSubmit(todo);

    if (submitResult instanceof Promise) {
      submitResult
        .then(() => setNewTodo(''))
        .catch((error) => {
          throw error;
        })
        .finally(() => setIsSubmitting(false));
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
        disabled={isSubmitting}
      />
    </form>
  );
};
