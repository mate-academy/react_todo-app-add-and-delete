import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { addTodo, USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  setErrorMessage: (error: ErrorMessage) => void;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: (todos: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  setTempTodo,
  setTodos,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsDisabled(true);

    const newTodo = {
      title: normalizeTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        input.current?.focus();
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
          disabled={isDisabled}
          value={title}
          ref={input}
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
