// Header.tsx
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */


import { FC, useState, FormEvent, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { client } from '../utils/fetchClient';

interface Props {
  onAdd: (todo: Todo) => void;
  setError: (message: string) => void;
}

export const Header: FC<Props> = ({ onAdd, setError }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Ensure input field is focused on mount
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setLoading(true);

    const newTodo: Todo = {
      id: 0, // Temporary id before API response
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo); // Display the temporary todo with loader

    try {
      const response = await client.post<Todo>('/todos', newTodo);

      onAdd(response); // Add the returned todo from the API to the list
      setTitle('');
    } catch (error) {
      setError('Unable to add a todo');
    } finally {
      setLoading(false);
      setTempTodo(null); // Hide the temporary todo after response handling
      if (inputRef.current) {
        inputRef.current.focus(); // Focus back on input field after response
      }
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </form>

      {tempTodo && (
        <div data-cy="TempTodo" className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              disabled
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </header>
  );
};
