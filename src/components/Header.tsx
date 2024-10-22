import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';
import { createTodo, USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: (updateTodos: (todos: Todo[]) => Todo[]) => void;
  setTempTodo: (todo: Todo | null) => void;
  onError: (error: ErrorType) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  onError,
  setTempTodo,
}) => {
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const allIsCompleted = todos.every(todo => todo.completed);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onError(ErrorType.DEFAULT);
  };

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      onError(ErrorType.TITLE);

      return;
    }

    const newTodo = {
      id: 0,
      title: normalizeTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const todo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, todo]);
      reset();
    } catch {
      onError(ErrorType.ADD);
      setTempTodo(null);
    } finally {
      setTempTodo(null);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allIsCompleted })}
        data-cy="ToggleAllButton"
      />

      <form method="POST" onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleChangeTitle}
          disabled={!!tempTodo}
          autoFocus
        />
      </form>
    </header>
  );
};
