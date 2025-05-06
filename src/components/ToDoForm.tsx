import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  onError: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const ToDoForm: React.FC<Props> = ({ onSubmit, onError, inputRef }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    const tempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    try {
      await onSubmit(tempTodo);
      setTitle('');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      onError('Unable to add a todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isSubmitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isSubmitting]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef} // Attach the ref to the input field
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleTitleChange}
        value={title}
        autoFocus
        disabled={isSubmitting}
      />
    </form>
  );
};
