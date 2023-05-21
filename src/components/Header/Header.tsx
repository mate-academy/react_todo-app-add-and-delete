import React, { FC, useEffect, useState } from 'react';
import { USER_ID } from '../../consts/consts';
import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoError';

interface Props {
  handleError: (message: TodoError) => void;
  onAddTodo: (todoData: Todo) => void;
}

export const Header: FC<Props> = ({
  handleError,
  onAddTodo,
}) => {
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      handleError(TodoError.EMPTY_TITLE);
    }

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsInputDisabled(true);
    onAddTodo(tempTodo);
  };

  useEffect(() => {
    if (isInputDisabled) {
      setIsInputDisabled(false);
      setTitle('');
    }
  }, [isInputDisabled]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
