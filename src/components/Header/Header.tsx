import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

import { USER_ID } from '../../helpers/userId';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  todoTitle: string,
  setTodoTitle: (value: string) => void
  onSubmit: ({ userId, title, completed }: Todo) => void,
  response: boolean,
  setIsError: (value: boolean) => void,
};

export const Header: React.FC<Props> = ({
  onSubmit,
  todos,
  todoTitle,
  setTodoTitle,
  response,
  setIsError,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, response]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsError(false);

    onSubmit({
      id: 0,
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    });
  };

  const todosExists = todos.length > 0;

  return (
    <header className="todoapp__header">
      {todosExists && (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          disabled={response}
        />
      )}
      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={todoTitle}
          disabled={response}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
