import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, addTodos } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setErrorMessage: (message: string) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  deletingIds,
  setTodos,
  setTempTodo,
  setErrorMessage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading, deletingIds.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodos(newTodo)
      .then((todo: Todo) => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableAdd);
        setTitle(newTodo.title);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
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
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          ref={inputRef}
          disabled={loading || !!deletingIds.length}
        />
      </form>
    </header>
  );
};
