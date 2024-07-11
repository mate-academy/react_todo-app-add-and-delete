import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

interface Props {
  handleAdd: (newTodo: Todo) => void;
  setErrorMessage: (message: string) => void;
  todosLength: number;
  title: string;
  onChangeTitle: (value: string) => void;
  isDeleteCompleted: boolean;
  deletedTodo: number;
  tempoTodo: Todo | null;
}
export const Header: React.FC<Props> = ({
  title,
  onChangeTitle,
  handleAdd,
  setErrorMessage,
  todosLength,
  isDeleteCompleted,
  deletedTodo,
  tempoTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      inputRef.current &&
      tempoTodo === null &&
      Object.is(deletedTodo, NaN) &&
      isDeleteCompleted === false
    ) {
      inputRef.current.focus();
    }
  }, [todosLength, tempoTodo, deletedTodo, isDeleteCompleted]);

  const handleSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    handleAdd(newTodo);
  };

  return (
    <>
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => onChangeTitle(e.target.value)}
            ref={inputRef}
            disabled={Boolean(tempoTodo)}
          />
        </form>
      </header>
    </>
  );
};
