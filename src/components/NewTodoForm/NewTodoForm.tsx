import React, { useState, useEffect } from 'react';
import type { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import * as clientMethods from '../../api/todos';

type Props = {
  onAdd: (value: Todo) => void;
  onError: (message: ErrorType) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  inputFocusRef: React.RefObject<HTMLInputElement>;
};

export const NewTodoForm: React.FC<Props> = ({
  onAdd,
  onError,
  setTempTodo,
  inputFocusRef,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    if (!isSubmiting) {
      inputFocusRef.current?.focus();
    }
  }, [isSubmiting, inputFocusRef]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // 1. Validate
    if (!title.trim()) {
      onError(ErrorType.EmptyTitle);

      return;
    }

    try {
      setIsSubmiting(true);

      setTempTodo({
        id: 0,
        userId: clientMethods.USER_ID,
        title: title.trim(),
        completed: false,
      });

      const createdTodo = await clientMethods.addTodo({
        userId: clientMethods.USER_ID,
        title: title.trim(),
        completed: false,
      });

      onAdd(createdTodo);
      onError(ErrorType.None);
      setTitle('');
    } catch {
      onError(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setIsSubmiting(false);
    }
    // 2. Clear previous error
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isSubmiting}
        ref={inputFocusRef}
      />
    </form>
  );
};
