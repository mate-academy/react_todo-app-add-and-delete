import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  handleAdd: (newTodo: Todo) => void;
  setErrorMessage: (message: string) => void;
  todosLength: number;
  title: string;
  onChangeTitle: (value: string) => void;
  isDeleteCompleted: boolean;
  deletedTodo: number | null;
  tempoTodo: Todo | null;
};

export const Header: React.FC<Props> = props => {
  const {
    title,
    onChangeTitle,
    handleAdd,
    setErrorMessage,
    todosLength,
    isDeleteCompleted,
    deletedTodo,
    tempoTodo,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      inputRef.current &&
      tempoTodo === null &&
      Object.is(deletedTodo, null) &&
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
            onChange={event => onChangeTitle(event.target.value)}
            ref={inputRef}
            disabled={Boolean(tempoTodo)}
          />
        </form>
      </header>
    </>
  );
};
