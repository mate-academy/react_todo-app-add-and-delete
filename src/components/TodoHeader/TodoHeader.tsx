import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';

interface Props {
  activeTodos: Todo[];
  newTodoField: React.RefObject<HTMLInputElement>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  userId: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoHeader: React.FC<Props> = ({
  activeTodos,
  newTodoField,
  error,
  setError,
  userId,
  setTodos,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);

    if (error) {
      setError('');
    }
  }

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    if (!title.trim()) {
      setError('Title should not be empty');

      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    setIsLoading(true);

    const newTodo = {
      id: 0,
      title: title.trim(),
      userId,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(userId, newTodo)
      .then((response) => {
        if (response) {
          // Add the new todo to the todos array
          setTodos((prevTodos) => [...prevTodos, response]);

          // Reset the title input
          setTitle('');

          // Focus on the newTodoField input
          newTodoField.current?.focus();
        } else {
          setError('Unable to add a todo');
        }
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!activeTodos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
        />
      )}

      {/* Add a todo on form submit */}
      {tempTodo && isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
      <form onSubmit={handleOnSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={newTodoField}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
