import React, { FormEvent, useRef, useState } from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TContext, useTodoContext } from './TodoContext';

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const {
    todos,
    setTodos,
    // hasError,
    setHasError,
    // tempTodos,
    setTempTodos,
  } = useTodoContext() as TContext;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      return setHasError('Title should not be empty');
    }

    const newTodo: Todo = {
      userId: 11550,
      id: Math.floor(Math.random() * 1003),
      title,
      completed: false,
    };

    setTempTodos({ ...newTodo, id: 0 });
    setIsSubmitting(true);

    return (addTodo(newTodo)
      .then(res => {
        setTodos([...todos, res]);
        setTitle('');
      })
      .catch(() => {
        setHasError('Unable to delete a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodos(null);
        titleInputRef.current?.focus(); // Ustaw fokus
      })
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        key="key-input-1"
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isSubmitting}
        autoFocus
        ref={titleInputRef} // Przypisanie Ref do pola tekstowego
      />
    </form>
  );
};
