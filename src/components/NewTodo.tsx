import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo, USER_ID } from '../api/todos';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onTypingChange?: (isTyping: boolean) => void;
  setError: (message: string | null) => void;
  newTodoRef?: React.RefObject<HTMLInputElement>;
  focusKey: number;
};

export const NewTodo: React.FC<Props> = ({
  setTodos,
  onTypingChange,
  setError,
  newTodoRef,
  focusKey,
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = newTodoRef ?? internalRef;

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusKey, loading]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setTitle(value);
    onTypingChange?.(value.trim().length > 0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Title should not be empty');
      return;
    }

    setLoading(true);

    const tempTodo: Todo = {
      id: Date.now(),
      title: trimmed,
      userId: USER_ID,
      completed: false,
      isTemp: true,
    };

    setTodos(prev => [...prev, tempTodo]);
    onTypingChange?.(false);

    try {
      const newTodo = await createTodo({
        userId: USER_ID,
        title: trimmed,
        completed: false,
      });

      setTodos(prev => prev.map(t => (t.id === tempTodo.id ? newTodo : t)));
      setTitle('');
    } catch {
      setError('Unable to add a todo');
      setTodos(prev => prev.filter(t => t.id !== tempTodo.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChange}
        disabled={loading}
      />
    </form>
  );
};
