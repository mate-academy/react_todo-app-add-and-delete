import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setErrorMessage: (message: string) => void;
  onAddTodo: (value: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement> | null;
  todosLength: number;
  isTitleDisabled: boolean;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  setErrorMessage,
  onAddTodo,
  inputRef,
  todosLength,
  isTitleDisabled,
}) => {
  const [title, setTitle] = useState<string>('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    try {
      await onAddTodo(title.trim());
      setTitle('');
    } catch (error) {}
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [todosLength, inputRef]);

  useEffect(() => {
    if (!isTitleDisabled) {
      inputRef?.current?.focus();
    }
  }, [isTitleDisabled, inputRef]);

  return (
    <>
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isTitleDisabled}
        />
      </form>
    </>
  );
};
