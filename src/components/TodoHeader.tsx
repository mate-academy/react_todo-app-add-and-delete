import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';
import { USER_ID } from '../api/todos';

type Props = {
  onSetTitleError: (errorMessage: ErrorTypes | null) => void;
  todos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
};

export const TodoHeader: React.FC<Props> = ({
  onSetTitleError,
  todos,
  onSubmit,
  tempTodo,
  setTempTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');

  const AllTodosCompleted = todos.every(todo => todo.completed);

  function reset() {
    setTitle('');
    onSetTitleError(null);
  }

  function handleChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    onSetTitleError(null);

    if (!title.trim()) {
      onSetTitleError('Title should not be empty');
      setTitle('');
      inputRef.current?.focus();

      return;
    }

    const completed = false;
    const userId = USER_ID;

    onSubmit({ title: title.trim(), completed, userId })
      .then(reset)
      .catch(() => {
        inputRef.current?.focus();
        setTempTodo(null);
      });
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: AllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          disabled={Boolean(tempTodo)}
        />
      </form>
    </header>
  );
};
