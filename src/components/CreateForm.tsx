import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  onAdd: (newTodo: Todo) => Promise<Todo>;
  setError: (message: ErrorMessage) => void;
  updateTodos: (todos: Todo[]) => void;
  setTempTodo: (todos: Todo | null) => void;
  focused: boolean;
  setFocused: (focused: boolean) => void;
};

export const CreateForm: React.FC<Props> = ({
  onAdd,
  setError,
  updateTodos,
  setTempTodo,
  focused,
  setFocused,
}) => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const field = useRef<HTMLInputElement>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(ErrorMessage.notError);

    if (!title.trim()) {
      setError(ErrorMessage.notEmptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
      isLoading: true,
    };

    setIsSaving(true);
    setTempTodo(newTodo);

    onAdd(newTodo)
      .then(response => {
        updateTodos(prev => [...prev, { ...response, isLoading: false }]);
        //console.log('Added successfull');
      })
      .catch(error => {
        setError(ErrorMessage.unableAdd);
        //console.log('Added failed');
        throw error;
      })
      .then(() => {
        //console.log('reset after successfull');
        setTitle('');
        setError(ErrorMessage.notError);
      })
      .finally(() => {
        setIsSaving(false);
        setTempTodo(null);
        setFocused(true);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    //setTimeout(() => setError(ErrorMessage.notError), 3000);
    setError(ErrorMessage.notError);
  };

  useEffect(() => {
    if (!isSaving && focused) {
      field.current?.focus();
    }
  }, [isSaving, focused]);

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={field}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isSaving}
        //autoFocus={!isSaving}
        value={title}
        onChange={handleTitleChange}
        onBlur={() => setFocused(false)}
      />
    </form>
  );
};
